import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Criteria } from './criteria.entity'; // Make sure you import the Criteria entity
import { Result } from './result.entity';

@Entity()
export class Query {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  userQuery: string;

  @Column('json')
  data: object;

  @ManyToOne(() => Criteria, (criteria) => criteria.queries)
  criteria: Criteria; // Add this line to define the reverse relation

  @OneToMany(() => Result, (result) => result.query)
  results: Result[];
}
