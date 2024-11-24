// src/modules/ahp/domain/entities/criteria.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Query } from './query.entity';
import { Item } from './item.entity';

@Entity()
export class Criteria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @OneToMany(() => Query, (query) => query.criteria)
  queries: Query[];

  @OneToMany(() => Item, (item) => item.criteria)
  items: Item[];
}
