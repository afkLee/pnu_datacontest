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
    private readonly termRepository: Repository<Term>,
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
    private readonly es: ElasticsearchService,
  ) {}

  //  검색 (isFavorite 포함)
  async search(query: string, category?: string, userId?: string): Promise<(Term & { isFavorite: boolean })[]> {
    const esQuery: any = {
      query: {
        bool: {
          must: [
            {
              multi_match: {
                query,
                fields: ['term^3', 'termEn^2', 'abbreviation', 'definition'],
                fuzziness: 'AUTO',
              },
            },
          ],
        },
      },
    };

    if (category) {
      esQuery.query.bool.filter = {
        term: { category },
      };
    }

    const result = await this.es.search({
      index: 'terms',
      body: esQuery,
    });

    const hits = result.hits.hits.map((hit: any) => hit._source as Term);

    // 즐겨찾기 ID 세트 준비
    let favoriteTermIds = new Set<number>();
    if (userId) {
      const favorites = await this.favoriteRepo.find({
        where: { userId },
        relations: ['term'],
      });
      favoriteTermIds = new Set(favorites.map(f => f.term.id));
    }

    const enrichedResults = await Promise.all(
      hits.map(async (term) => {
        if (!term.definition) {
          const generated = await generateDefinition(term.term, term.termEn);
          if (generated?.trim()) {
            term.definition = generated;
            await this.termRepository.save(term);
          }
        }

        return {
          ...term,
          isFavorite: favoriteTermIds.has(term.id),
        };
      }),
    );

    return enrichedResults;
  }

  //  Elasticsearch에 전체 데이터 동기화
  async syncAllToElasticsearch(): Promise<string> {
    const allTerms = await this.termRepository.find();
    const body = allTerms.flatMap(term => [
      { index: { _index: 'terms', _id: term.id } },
      term,
    ]);

    await this.es.bulk({ refresh: true, body });
    return `${allTerms.length} terms indexed in Elasticsearch.`;
  }

  //  AI 해설 반환
  async askWithAI(termInput: string): Promise<string> {
    const keyword = termInput.trim();
    console.log('입력 용어:', keyword);

    const results = await this.termRepository
      .createQueryBuilder('term')
      .where(
        'term.term ILIKE :kw OR term.termEn ILIKE :kw OR term.abbreviation ILIKE :kw',
        { kw: `%${keyword}%` },
      )
      .getMany();

    if (results.length === 0) {
      return '해당 용어를 찾을 수 없습니다.';
    }

    const result = results[0];

    if (!result.definition) {
      const aiAnswer = await generateDefinition(result.term, result.termEn);
      return aiAnswer;
    }

    return `${result.term}은(는) ${result.termEn}입니다.\n\n설명: ${result.definition}`;
  }
}
