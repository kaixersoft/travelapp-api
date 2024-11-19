import { Module, DynamicModule, Global } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
@Global()
@Module({})
export class DatabaseModule {
  static forRoot(connections: TypeOrmModuleOptions[]): DynamicModule {
    return {
      module: DatabaseModule,
      imports: connections.map((connection) =>
        TypeOrmModule.forRoot(connection),
      ),
      exports: [TypeOrmModule],
    };
  }
}
