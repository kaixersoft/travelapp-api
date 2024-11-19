import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../user/domain/repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async register(email: string, password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.createUser(email, hashedPassword);

    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
