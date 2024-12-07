import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DOMAIN_DB } from 'src/common/database/connection/postgres.db-connection';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User, DOMAIN_DB.DB_NAME)
    private readonly repository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { email } });
  }

  async createUser(email: string, password: string): Promise<User> {
    const user = this.repository.create({ email, password });
    return this.repository.save(user);
  }

  async findById(id: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { id } });
  }
}
