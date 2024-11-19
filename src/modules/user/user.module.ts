import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { UserRepository } from './domain/repository/user.repository';
import { DOMAIN_DB } from 'src/common/database/connection/postgres.db-connection';
import { UserController } from './user.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User], DOMAIN_DB.DB_NAME)],
  providers: [UserRepository],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
