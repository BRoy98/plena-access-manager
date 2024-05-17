import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/response/login.response.dto';

@Injectable()
export class AdminService {
  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string): Promise<LoginResponseDto> {
    // For simplicity, I'm assuming a hardcoded username and password.

    let payload = {};
    if (username === 'admin' && password === 'password') {
      payload = { username, role: 'ADMIN' };
    } else if (username === 'user' && password === 'password') {
      payload = { username, role: 'USER' };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
