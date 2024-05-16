import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessManagerService {
  getHello(): string {
    return 'Hello World!';
  }
}
