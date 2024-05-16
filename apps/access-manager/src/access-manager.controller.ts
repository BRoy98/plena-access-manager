import { Controller, Get } from '@nestjs/common';
import { AccessManagerService } from './access-manager.service';

@Controller()
export class AccessManagerController {
  constructor(private readonly accessManagerService: AccessManagerService) {}

  @Get()
  getHello(): string {
    return this.accessManagerService.getHello();
  }
}
