import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Term } from './entities/term.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { generateDefinition } from '../utils/generateDefinition';

@Injectable()
export class TermsService {
  constructor(
    @InjectRepository(Term)
    private readonly termRepository: Repository<Term>, // 용어 데이터베이스 테이블 연결
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>, // 즐겨찾기 테이블 연결
    private readonly es: ElasticsearchService, // Elasticsearch 서비스 주입
  ) {}

  /**
   * 🔍 통합 검색 기능 (Elasticsearch 사용)
   * @param query - 검색어
   * @param category - 선택된 카테고리 (금속/통상 등)
   * @param userId - 즐겨찾기 확인용 사용자 ID
   */
  async search(query: string, category?: string, userId?: string): Promise<(Term & { isFavorite: boolean })[]> {
    // Elasticsearch 검색 쿼리 구성
    const esQuery: any = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['term^3', 'termEn^2', 'abbreviation', 'definition'], // 필드별 가중치 설정
                fuzziness: 'AUTO', // 철자 오차 허용
                operator: 'and',
              },
            },
          ],
        },
      },
    };

    // 카테고리 필터 적용 (전체가 아닐 경우에만)
    if (category && category !== '전체') {
      esQuery.query.bool.filter = {
        term: { category },
      };
    }

    // Elasticsearch 검색 실행
    const result = await this.es.search({
      index: 'terms',
      body: esQuery,
    });

    const hits = result.hits.hits.map((hit: any) => hit._source as Term);

    // 즐겨찾기 데이터 가져오기 (로그인한 사용자일 경우)
    let favoriteTermIds = new Set<number>();
    if (userId) {
      const favorites = await this.favoriteRepo.find({
        where: { userId },
      });
      favoriteTermIds = new Set(favorites.map(f => f.termId));
    }

    // 정의 없는 용어는 AI로 정의 생성 → DB 업데이트
    const enrichedResults = await Promise.all(
      hits.map(async (term) => {
        if (!term.definition) {
          const generated = await generateDefinition(term.term, term.termEn);
          if (generated?.trim()) {
            term.definition = generated;
            await this.termRepository.save(term); // 정의 저장
          }
        }

        return {
          ...term,
          isFavorite: favoriteTermIds.has(term.id), // 즐겨찾기 여부 포함
        };
      }),
    );

    return enrichedResults;
  }

  /**
   * 🔄 데이터베이스에 있는 모든 용어를 Elasticsearch에 동기화
   */
  async syncAllToElasticsearch(): Promise<string> {
    const allTerms = await this.termRepository.find();

    if (allTerms.length === 0) {
      console.log('❗ Elasticsearch 색인할 데이터가 없습니다.');
      return '색인할 데이터 없음';
    }

    // Elasticsearch bulk 색인 요청 형식으로 변환
    const body = allTerms.flatMap(term => [
      { index: { _index: 'terms', _id: term.id } },
      term,
    ]);

    await this.es.bulk({ refresh: true, body });
    return `${allTerms.length}건 색인 완료`;
  }

  /**
   * 💡 입력된 term, termEn으로 AI 정의 생성
   * DB에 정의가 없는 경우 AI로 생성해서 사용자에게 설명 제공
   */
  async askWithAI(term: string, termEn?: string): Promise<string> {
    const keyword = term?.trim();
    if (!keyword) return '입력된 용어가 없습니다.';

    // 데이터베이스에서 해당 용어 검색 (대소문자 무시)
    const results = await this.termRepository
      .createQueryBuilder('term')
      .where(
        'term.term ILIKE :kw OR term.termEn ILIKE :kw OR term.abbreviation ILIKE :kw',
        { kw: `%${keyword}%` },
      )
      .getMany();

    // DB에 없으면 → term + termEn으로 AI 설명 생성
    if (results.length === 0) {
      if (term && termEn) {
        return await generateDefinition(term, termEn);
      } else {
        return '해당 용어를 찾을 수 없습니다.';
      }
    }

    const result = results[0];

    // 정의가 없는 경우 → AI로 설명 생성
    if (!result.definition) {
      const aiAnswer = await generateDefinition(result.term || '', result.termEn || '');
      return aiAnswer;
    }

    // 정의가 있는 경우 → 그대로 반환
    return `${result.term}은(는) ${result.termEn}입니다.\n\n설명: ${result.definition}`;
  }
}
