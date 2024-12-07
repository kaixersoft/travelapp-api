import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Criteria } from '../modules/ahp/domain/entities/criteria.entity';

@Injectable()
export class CriteriaSeeder implements Seeder {
  constructor(
    @InjectRepository(Criteria)
    private readonly criteriaRepository: Repository<Criteria>,
  ) {}

  async seed(): Promise<any> {
    const mainCriteria = [
      { name: 'Tourist Activities', code: 'M1' },
      { name: 'Facilities', code: 'M2' },
      { name: 'Cost', code: 'M3' },
      { name: 'Accessibility', code: 'M4' },
    ];

    const criteriaEntities = mainCriteria.map((criterion) =>
      this.criteriaRepository.create(criterion),
    );

    await this.criteriaRepository.save(criteriaEntities);
    return criteriaEntities;
  }

  async drop(): Promise<any> {
    await this.criteriaRepository.clear();
  }
}
