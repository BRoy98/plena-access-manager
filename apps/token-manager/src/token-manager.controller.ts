import { Controller, Get } from '@nestjs/common';
import { TokenManagerService } from './token-manager.service';

@Controller()
export class TokenManagerController {
  constructor(private readonly tokenManagerService: TokenManagerService) {}

  @Get()
  getHello(): string {
    return this.tokenManagerService.getHello();
  }
}
