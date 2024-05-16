import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenManagerService {
  getHello(): string {
    return 'Hello World!';
  }
}
