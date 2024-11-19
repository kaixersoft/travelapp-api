import { CustomDataSource } from './base-db.datasource';
import { EnvUtils } from '../../utils/env.utils';

const connectionDataSource = CustomDataSource.create({
  host: EnvUtils.get('DB_HOST'),
  port: parseInt(EnvUtils.get('DB_PORT')),
  username: EnvUtils.get('DB_USER'),
  password: EnvUtils.get('DB_PASSWORD'),
  database: EnvUtils.get('DB_NAME'),
  entities: ['src/**/*/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
  options: {
    autoLoadEntities: true,
    extra: {
      ssl: {
        rejectUnauthorized: false,
      },
      timezone: 'UTC',
      // Connection Pool
      max: 5,
      min: 2,
    },
  },
});

export default connectionDataSource;
