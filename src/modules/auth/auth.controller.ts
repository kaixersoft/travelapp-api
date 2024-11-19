import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './domain/dto/register.dto';
import { LoginDto } from './domain/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return { accessToken };
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.register(
      registerDto.email,
      registerDto.password,
    );
    return { accessToken };
  }
}
