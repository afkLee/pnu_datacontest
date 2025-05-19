// src/favorites/favorites.controller.ts
import { Controller, Post, Get, Delete, Body, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  async add(@Body() body: { userId: string; termId: number }) {
    return this.favoritesService.addFavorite(body.userId, body.termId);
  }

  // ✅ category 필터링 반영
  @Get()
  async list(
    @Query('userId') userId: string,
    @Query('category') category?: string,
  ) {
    return this.favoritesService.getFavorites(userId, category);
  }

  @Delete()
  async remove(
    @Query('userId') userId: string,
    @Query('termId') termId: number,
  ) {
    return this.favoritesService.removeFavorite(userId, +termId);
  }

  @Get('check')
  async isFavorite(
    @Query('userId') userId: string,
    @Query('termId') termId: string,
  ) {
    return {
      isFavorite: await this.favoritesService.isFavorite(userId, +termId),
    };
  }
}
