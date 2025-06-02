import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Term } from '../../terms/entities/term.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: '즐겨찾기 ID (자동 생성)' })
  id: number;

  @Column()
  @ApiProperty({ example: 'user123', description: '사용자 ID (UUID)' })
  userId: string;

  @ManyToOne(() => Term, { eager: true, onDelete: 'CASCADE' })
  @ApiProperty({ type: () => Term, description: '즐겨찾기한 용어' })
  term: Term;

  @CreateDateColumn()
  @ApiProperty({ example: '2024-06-02T15:30:00.000Z', description: '즐겨찾기 추가 시각' })
  createdAt: Date;
}
