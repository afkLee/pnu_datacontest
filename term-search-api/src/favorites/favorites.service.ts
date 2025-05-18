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

  async getFavorites(userId: string): Promise<Term[]> {
    const favorites = await this.favoriteRepo.find({ where: { userId } });
    return favorites.map(f => f.term);
  }

  async removeFavorite(userId: string, termId: number): Promise<void> {
    await this.favoriteRepo.delete({ userId, term: { id: termId } });
  }
}
