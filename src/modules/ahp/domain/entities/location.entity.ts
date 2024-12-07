import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'float', nullable: true })
  cost: number; // Cost score for this location

  @Column({ type: 'float', nullable: true })
  facilities: number; // Facilities score for this location

  @Column({ type: 'float', nullable: true })
  touristActivities: number; // Tourist Activities score for this location

  @Column({ type: 'float', nullable: true })
  accessibility: number; // Accessibility score for this location

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
