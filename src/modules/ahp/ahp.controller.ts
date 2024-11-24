// src/ahp/ahp.controller.ts
import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { Item } from './domain/entities/item.entity';
import { Result } from './domain/entities/result.entity';
import { AHPService } from './domain/services/ahp.service';
import { Query } from './domain/entities/query.entity';

@Controller('ahp')
export class AHPController {
  constructor(private readonly ahpService: AHPService) {}

  @Post('criteria')
  createCriteria(@Body() body: { name: string }) {
    return this.ahpService.createCriteria(body.name);
  }

  @Post('query')
  saveQuery(
    @Body() body: { userQuery: string; data: object; criteriaId: number },
  ): Promise<Query> {
    return this.ahpService.saveQuery(
      body.userQuery,
      body.data,
      body.criteriaId,
    );
  }

  @Post('rank/:queryId')
  async rank(@Param('queryId') queryId: number): Promise<Result> {
    return this.ahpService.performRanking(queryId);
  }

  @Get('result/:queryId')
  async getResult(@Param('queryId') queryId: number): Promise<Result> {
    return this.ahpService.getResult(queryId);
  }

  @Post('item')
  async createItem(
    @Body() body: { name: string; criteriaId: number },
  ): Promise<Item> {
    return this.ahpService.createItem(body.name, body.criteriaId);
  }

  @Get('items/:criteriaId')
  async getItemsByCriteria(
    @Param('criteriaId') criteriaId: number,
  ): Promise<Item[]> {
    return this.ahpService.getItemsByCriteria(criteriaId);
  }
}
