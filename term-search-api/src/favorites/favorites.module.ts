// src/favorites/favorites.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { Favorite } from './entities/favorite.entity';
import { Term } from '../terms/entities/term.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Term])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
