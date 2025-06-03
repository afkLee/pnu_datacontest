// src/favorites/favorites.service.ts
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

    const exists = await this.favoriteRepo.findOneBy({ userId, term: { id: termId } });
    if (exists) return exists;

    const favorite = this.favoriteRepo.create({ userId, term });
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

    const favorite = await this.favoriteRepo
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.term', 'term')
      .where('favorite.userId = :userId', { userId })
      .andWhere('term.id = :termId', { termId })
      .getOne();

    console.log('🎯 찾은 favorite:', favorite);

    if (!favorite) {
      console.error('❗ 즐겨찾기 항목을 찾을 수 없습니다.');
      throw new Error('즐겨찾기 항목을 찾을 수 없습니다.');
    }

    await this.favoriteRepo.remove(favorite);
    console.log('✅ 삭제 완료');
  }


  async isFavorite(userId: string, termId: number): Promise<boolean> {
  const favorite = await this.favoriteRepo.findOne({
    where: {
      userId,
      term: { id: termId },
    },
  });
  return !!favorite;
}
}
