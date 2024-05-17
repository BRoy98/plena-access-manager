import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/response/login.response.dto';

@Injectable()
export class AdminService {
  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string): Promise<LoginResponseDto> {
    // For simplicity, I'm assuming a hardcoded username and password.

    if (username === 'admin' && password === 'password') {
      const payload = { username, role: 'ADMIN' };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
