import { Module } from '@nestjs/common';
import { postgresDbConnections } from 'src/common/database/connection/postgres.db-connection';
import { DatabaseModule } from 'src/common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AHPModule } from './ahp/ahp.module';

@Module({
  imports: [
    DatabaseModule.forRoot(postgresDbConnections),
    AuthModule,
    UserModule,
    AHPModule,
  ],
})
export class AppModule {}
