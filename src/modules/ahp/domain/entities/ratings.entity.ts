import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Criteria } from './criteria.entity';
import { User } from '../../../user/domain/entities/user.entity';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Criteria, { nullable: false })
  criteria: Criteria;

  @Column({ type: 'varchar', length: 255 })
  pair: string; // Format: "criteriaCode1-criteriaCode2"

  @Column({ type: 'float' })
  score: number;

  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string; // Store the user's ID who created the rating

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
