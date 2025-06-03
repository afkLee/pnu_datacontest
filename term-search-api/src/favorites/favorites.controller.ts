import { Controller, Post, Get, Delete, Body, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ApiTags, ApiOperation, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Favorite } from './entities/favorite.entity';
import { Term } from '../terms/entities/term.entity';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: '즐겨찾기 추가', description: '사용자 ID와 용어 ID로 즐겨찾기 추가' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'user123' },
        termId: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({ status: 201, type: Favorite, description: '추가된 즐겨찾기 정보 반환' })
  async add(@Body() body: { userId: string; termId: number }) {
    return this.favoritesService.addFavorite(body.userId, body.termId);
  }

  @Get()
  @ApiOperation({ summary: '즐겨찾기 목록 조회', description: '사용자 ID로 즐겨찾기한 용어 목록 조회' })
  @ApiQuery({ name: 'userId', description: '사용자 ID', type: String })
  @ApiQuery({ name: 'category', description: '카테고리 (선택)', type: String, required: false })
  @ApiResponse({ status: 200, type: [Term], description: '즐겨찾기한 용어 목록' })
  async list(
    @Query('userId') userId: string,
    @Query('category') category?: string,
  ) {
    return this.favoritesService.getFavorites(userId, category);
  }

  @Delete()
  @ApiOperation({ summary: '즐겨찾기 제거', description: '사용자 ID와 용어 ID로 즐겨찾기 제거' })
  @ApiQuery({ name: 'userId', description: '사용자 ID', type: String })
  @ApiQuery({ name: 'termId', description: '용어 ID', type: Number })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 제거 완료',
    schema: { example: { message: '즐겨찾기 제거 완료' } },
  })
  async remove(
    @Query('userId') userId: string,
    @Query('termId') termId: number,
  ) {
    await this.favoritesService.removeFavorite(userId, +termId);
    return { message: '즐겨찾기 제거 완료' }; // ✅ 반환 메시지 추가
  }

  @Get('check')
  @ApiOperation({ summary: '즐겨찾기 여부 확인', description: '사용자 ID와 용어 ID로 즐겨찾기 여부 확인' })
  @ApiQuery({ name: 'userId', description: '사용자 ID', type: String })
  @ApiQuery({ name: 'termId', description: '용어 ID', type: Number })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 여부 반환',
    schema: { example: { isFavorite: true } },
  })
  async isFavorite(
    @Query('userId') userId: string,
    @Query('termId') termId: number, // ✅ 타입 통일 (string → number)
  ) {
    return {
      isFavorite: await this.favoritesService.isFavorite(userId, termId),
    };
  }
}
