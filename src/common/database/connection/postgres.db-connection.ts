import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvUtils } from 'src/common/utils/env.utils';

export const DOMAIN_DB = {
  DB_NAME: EnvUtils.get('DB_NAME'),
};

const COMMON_DB_CONFIG = {
  host: EnvUtils.get('DB_HOST'),
  port: parseInt(EnvUtils.get('DB_PORT')),
  username: EnvUtils.get('DB_USER'),
  password: EnvUtils.get('DB_PASSWORD'),
  synchronize: false,
  dateStrings: [
    'DATE', // specify the type of date columns to use string serialization
  ],
  autoLoadEntities: true,
  logging: false,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
    timezone: 'UTC',
    // Connection Pool
    max: 5,
    min: 2,
  },
};

export const postgresDbConnections: TypeOrmModuleOptions[] = [
  {
    type: 'postgres',
    ...COMMON_DB_CONFIG,
    name: DOMAIN_DB.DB_NAME,
    database: DOMAIN_DB.DB_NAME,
  },
];
