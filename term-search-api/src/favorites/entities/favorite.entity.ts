import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Term } from '../../terms/entities/term.entity';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string; // UUID

  @ManyToOne(() => Term, { eager: true, onDelete: 'CASCADE' })
  term: Term;

  @CreateDateColumn()
  createdAt: Date;
}
