// src/modules/ahp/domain/entities/result.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Query } from './query.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  results: object; // Storing the AHP ranking results

  @ManyToOne(() => Query, (query) => query.results)
  query: Query;
}
