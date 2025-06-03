import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { Term } from '../terms/entities/term.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
    @InjectRepository(Term)
    private readonly termRepo: Repository<Term>,
    private readonly dataSource: DataSource,  // 🔥 DataSource 추가
  ) {}

  // 즐겨찾기 추가
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
      termId,  // 🔥 termId 명시적으로 넣기
    });

    return this.favoriteRepo.save(favorite);
  }

  // 즐겨찾기 목록 조회
  async getFavorites(userId: string, category?: string): Promise<Term[]> {
    const favorites = await this.favoriteRepo.find({
      where: { userId },
      relations: ['term'],
    });

    return favorites
      .map(f => f.term)
      .filter(term => !category || term.category === category);
  }

  // 즐겨찾기 삭제 (QueryRunner 방식)
  async removeFavorite(userId: string, termId: number): Promise<void> {
    console.log('🔥 removeFavorite 호출:', userId, termId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.query(
        `DELETE FROM "favorites" WHERE "userId" = $1 AND "termId" = $2`,
        [userId, termId],
      );

      console.log('🎯 SQL 삭제 실행 결과:', result);

      if (result.rowCount === 0) {
        throw new Error('즐겨찾기 항목을 찾을 수 없습니다.');
      }

      await queryRunner.commitTransaction();
      console.log('✅ 삭제 완료');
    } catch (err) {
      console.error('❗ 삭제 중 오류:', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 즐겨찾기 여부 확인
  async isFavorite(userId: string, termId: number): Promise<boolean> {
    const favorite = await this.favoriteRepo.findOne({
      where: { userId, term: { id: termId } },
    });
    return !!favorite;
  }
}
