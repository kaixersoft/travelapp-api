import { DataSource, DataSourceOptions } from 'typeorm';

export class CustomDataSource extends DataSource {
  constructor(options: DataSourceOptions) {
    super(options);
  }

  static create({
    host,
    port,
    username,
    password,
    database,
    entities,
    migrations,
    options,
  }: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    migrations: string[];
    options?: object;
  }): DataSource {
    return new DataSource({
      migrationsTableName: 'migrations',
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      logging: true,
      synchronize: false,
      entities,
      migrations,
      ...options,
    });
  }
}
// USAGE : db-1.db-datasource.ts
//
// import { CustomDataSource } from '../../../../common/database/datasource/base-db.datasource';
// import { EnvUtils } from '../../../../common/utils/env.utils';

// const DB_FOLDER = 'db2';
// const connectionDataSource = CustomDataSource.create({
//   host: EnvUtils.get('DB_HOST_2'),
//   port: parseInt(EnvUtils.get('DB_PORT_2')),
//   username: EnvUtils.get('DB_USER_2'),
//   password: EnvUtils.get('DB_PASSWORD_2'),
//   database: EnvUtils.get('DB_DATABASE_2'),
//   entities: [`src/domain/entity/${DB_FOLDER}/entity/*.ts`],
//   migrations: [`src/domain/entity/${DB_FOLDER}/migrations/*.ts`],
// });

// export default connectionDataSource;

// on your package.json
// "typeorm1": "typeorm-ts-node-commonjs -d ./src/domain/data/database/datasource/db-1.db-datasource.ts",
// "typeorm1:migration:generate": "npm run typeorm1 migration:generate -n ",
// "typeorm1:migration:run": "npm run typeorm1 migration:run",
// "typeorm1:migration:revert": "npm run typeorm1 migration:revert",
