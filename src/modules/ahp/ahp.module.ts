import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOMAIN_DB } from 'src/common/database/connection/postgres.db-connection';
import { Criteria } from './domain/entities/criteria.entity';
import { Item } from './domain/entities/item.entity';
import { Query } from './domain/entities/query.entity';
import { Result } from './domain/entities/result.entity';
import { AHPController } from './ahp.controller';
import { AHPService } from './domain/services/ahp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Criteria, Item, Query, Result],
      DOMAIN_DB.DB_NAME,
    ),
  ],
  controllers: [AHPController],
  providers: [AHPService],
})
export class AhpModule {}
