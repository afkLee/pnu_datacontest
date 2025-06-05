import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('terms')  // 테이블 이름 명시
export class Term {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: '용어 ID (자동 생성)' })
  id: number;

  @Column()
  @ApiProperty({ example: '금속', description: '용어 카테고리' })
  category: string;

  @Column()
  @ApiProperty({ example: '주강', description: '한글 용어' })
  term: string;

  @Column({ nullable: true, name: 'term_en' })
  @ApiProperty({ example: 'Cast Steel', description: '영문 용어', required: false })
  termEn: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'CS', description: '약어', required: false })
  abbreviation: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ example: '주조로 제작된 강철.', description: '용어 설명', required: false })
  definition: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'KATS', description: '출처', required: false })
  source: string;
}
