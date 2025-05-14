import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('terms')  // 테이블 이름 명시
export class Term {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  term: string;

  @Column({ nullable: true, name: 'term_en' })
  termEn: string;

  @Column({ nullable: true })
  abbreviation: string;

  @Column({ type: 'text', nullable: true })
  definition: string;

  @Column({ nullable: true })
  source: string;
}
