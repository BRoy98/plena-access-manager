import { Module } from '@nestjs/common';
import { AccessManagerController } from './access-manager.controller';
import { AccessManagerService } from './access-manager.service';

@Module({
  imports: [],
  controllers: [AccessManagerController],
  providers: [AccessManagerService],
})
export class AccessManagerModule {}
