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

  async search(query: string, category?: string): Promise<Term[]> {
    const qb = this.termRepository.createQueryBuilder('term');

    qb.where(
      'term.term ILIKE :query OR term.termEn ILIKE :query OR term.abbreviation ILIKE :query',
      { query: `%${query}%` },
    );

    if (category) {
      qb.andWhere('term.category = :category', { category });
    }

    return qb.getMany();
  }

  async askWithAI(termInput: string): Promise<string> {
    const keyword = termInput.trim();  // 그냥 그대로 사용

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
