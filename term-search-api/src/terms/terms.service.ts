import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Term } from './entities/term.entity';
import { generateDefinition } from '../utils/generateDefinition';

@Injectable()
export class TermsService {
  constructor(
    @InjectRepository(Term)
    private readonly termRepository: Repository<Term>,
  ) {}

  // ✅ 검색 API - definition이 없으면 생성하여 DB에 저장
  async search(query: string, category?: string): Promise<Term[]> {
    const qb = this.termRepository.createQueryBuilder('term');

    qb.where(
      'term.term ILIKE :query OR term.termEn ILIKE :query OR term.abbreviation ILIKE :query',
      { query: `%${query}%` },
    );

    if (category) {
      qb.andWhere('term.category = :category', { category });
    }

    const results = await qb.getMany();

    const enrichedResults = await Promise.all(
      results.map(async (term) => {
        if (!term.definition) {
          const generated = await generateDefinition(term.term, term.termEn);

          if (generated?.trim()) {
            term.definition = generated;
            await this.termRepository.save(term); // ✅ DB에 저장
          }
        }
        return term;
      })
    );

    return enrichedResults;
  }

  // ✅ 질문 응답 API - definition이 없으면 생성 (저장 X)
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
