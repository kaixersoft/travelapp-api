import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Criteria } from '../modules/ahp/domain/entities/criteria.entity';
import { Location } from '../modules/ahp/domain/entities/location.entity';
import { CriteriaSeeder } from './criteria.seeder';
import { EnvUtils } from '../common/utils/env.utils';

import { LocationSeeder } from './location.seeder';

seeder({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: EnvUtils.get('DB_HOST'),
      port: parseInt(EnvUtils.get('DB_PORT')),
      database: EnvUtils.get('DB_NAME'),
      username: EnvUtils.get('DB_USER'),
      password: EnvUtils.get('DB_PASSWORD'),
      autoLoadEntities: true,
      entities: [Criteria, Location],
      synchronize: false,
      logging: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    TypeOrmModule.forFeature([Criteria, Location]),
  ],
}).run([CriteriaSeeder, LocationSeeder]);
