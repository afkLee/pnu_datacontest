import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { Term } from '../terms/entities/term.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
    @InjectRepository(Term)
    private readonly termRepo: Repository<Term>,
  ) {}

  async addFavorite(userId: string, termId: number): Promise<Favorite> {
    const term = await this.termRepo.findOneBy({ id: termId });
    if (!term) throw new NotFoundException('Term not found');

    const exists = await this.favoriteRepo.findOne({
      where: { userId, term: { id: termId } },
    });
    if (exists) return exists;

    const favorite = this.favoriteRepo.create({
      userId,
      term,
      termId, // 🔥 termId 명시적으로 넣어주기
    });
    return this.favoriteRepo.save(favorite);
  }

  async getFavorites(userId: string, category?: string): Promise<Term[]> {
    const favorites = await this.favoriteRepo.find({
      where: { userId },
      relations: ['term'],
    });

    return favorites
      .map(f => f.term)
      .filter(term => !category || term.category === category);
  }

  async removeFavorite(userId: string, termId: number): Promise<void> {
    console.log('🔥 removeFavorite 호출:', userId, termId);

    const result = await this.favoriteRepo.query(
      `DELETE FROM "favorites" WHERE "userId" = $1 AND "termId" = $2`,
      [userId, termId],
    );

    console.log('🎯 SQL 삭제 결과:', result);
  }




  async isFavorite(userId: string, termId: number): Promise<boolean> {
    const favorite = await this.favoriteRepo.findOneBy({ userId, termId });
    return !!favorite;
  }
}
