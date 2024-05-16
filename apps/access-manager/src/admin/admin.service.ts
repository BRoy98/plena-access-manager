import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(private readonly jwtService: JwtService) {}

  async login(username: string, password: string): Promise<string> {
    // For simplicity, we're assuming a hardcoded username and password.
    // In a real application, you should use a user database.
    if (username === 'admin' && password === 'password') {
      const payload = { username };
      return this.jwtService.sign(payload);
    }
    throw new Error('Invalid credentials');
  }
}
