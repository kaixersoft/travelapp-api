// src/ahp/ahp.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Criteria } from '../entities/criteria.entity';
import { Query } from '../entities/query.entity';
import { Result } from '../entities/result.entity';
import { Item } from '../entities/item.entity';
import * as AHP from 'ahp';
import { DOMAIN_DB } from 'src/common/database/connection/postgres.db-connection';

@Injectable()
export class AHPService {
  private ahp: any;

  constructor(
    @InjectRepository(Criteria, DOMAIN_DB.DB_NAME)
    private criteriaRepository: Repository<Criteria>,
    @InjectRepository(Query, DOMAIN_DB.DB_NAME)
    private queryRepository: Repository<Query>,
    @InjectRepository(Result, DOMAIN_DB.DB_NAME)
    private resultRepository: Repository<Result>,
    @InjectRepository(Item, DOMAIN_DB.DB_NAME)
    private itemRepository: Repository<Item>,
  ) {
    this.ahp = new AHP();
  }

  async createCriteria(name: string): Promise<Criteria> {
    const criteria = this.criteriaRepository.create({ name });
    return this.criteriaRepository.save(criteria);
  }

  async saveQuery(
    userQuery: string,
    data: object,
    criteriaId: number,
  ): Promise<Query> {
    const criteria = await this.criteriaRepository.findOne({
      where: { id: criteriaId },
    });
    const query = this.queryRepository.create({ userQuery, data, criteria });
    return this.queryRepository.save(query);
  }

  async performRanking(queryId: number): Promise<Result> {
    // Retrieve the query data with associated criteria
    const query = await this.queryRepository.findOne({
      where: { id: queryId },
      relations: ['criteria'],
    });

    if (!query) {
      throw new Error('Query not found');
    }

    const criterion = query.criteria.name;

    if (!criterion) {
      throw new Error('No criterion found for this query');
    }

    // Extract data from the query and convert it into preferences
    const { data } = query; // data should have item values, e.g., { itemA: 10, itemB: 15 }

    // Convert data to preferences format: Compare itemA with itemB
    const preferences = [
      {
        preferredItem: 'itemA',
        comparingItem: 'itemB',
        scale: data['itemA'] / data['itemB'],
      },
      {
        preferredItem: 'itemB',
        comparingItem: 'itemA',
        scale: data['itemB'] / data['itemA'],
      },
    ];

    // Register the criterion (e.g., 'Price')
    this.ahp.addCriteria([criterion]);

    // Register the items with AHP
    this.ahp.addItem('itemA');
    this.ahp.addItem('itemB');

    // Perform AHP ranking using the `rankCriteriaItem` method from the `AHP` package
    this.ahp.rankCriteriaItem(criterion, preferences); // Rank the items based on preferences

    // returns the ranked results (check the package for how results are retrieved)
    const result = this.ahp.run();

    console.log({
      criterion,
      preferences,
      result,
    });

    // Create and save the result entity
    const resultEntity = this.resultRepository.create({
      results: result,
      query,
    });

    return this.resultRepository.save(resultEntity);
  }

  // New method to create an item for ranking
  async createItem(name: string, criteriaId: number): Promise<Item> {
    const criteria = await this.criteriaRepository.findOne({
      where: { id: criteriaId },
    });
    const item = this.itemRepository.create({ name, criteria });
    return this.itemRepository.save(item);
  }

  // New method to get all items for a criteria
  async getItemsByCriteria(criteriaId: number): Promise<Item[]> {
    return this.itemRepository.find({
      where: { criteria: { id: criteriaId } },
    });
  }

  // New method to retrieve ranking result for a query
  async getResult(queryId: number): Promise<Result> {
    return this.resultRepository.findOne({
      where: { query: { id: queryId } },
      relations: ['query'],
    });
  }
}
