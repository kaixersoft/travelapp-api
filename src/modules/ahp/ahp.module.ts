import { Module } from '@nestjs/common';
import { AhpController } from './ahp.controller';
import { AhpService } from './domain/services/ahp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DOMAIN_DB } from 'src/common/database/connection/postgres.db-connection';
import { Criteria } from './domain/entities/criteria.entity';
import { Rating } from './domain/entities/ratings.entity';
import { Location } from './domain/entities/location.entity';
import { RatingService } from './domain/services/rating.service';
import { UserRepository } from '../user/domain/repository/user.repository';
import { User } from '../user/domain/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Criteria, Location, Rating, User],
      DOMAIN_DB.DB_NAME,
    ),
  ],
  providers: [AhpService, RatingService, UserRepository],
  controllers: [AhpController],
})
export class AHPModule {}
