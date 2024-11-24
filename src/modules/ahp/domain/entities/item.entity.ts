// src/modules/ahp/domain/entities/item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Criteria } from './criteria.entity'; // Import Criteria entity

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @ManyToOne(() => Criteria, (criteria) => criteria.items)
  criteria: Criteria; // This line defines the many-to-one relationship with Criteria
}
