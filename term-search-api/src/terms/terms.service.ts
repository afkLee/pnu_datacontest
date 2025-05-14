import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Term } from './entities/term.entity';

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
}
