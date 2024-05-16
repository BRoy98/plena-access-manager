import { Module } from '@nestjs/common';
import { TokenManagerController } from './token-manager.controller';
import { TokenManagerService } from './token-manager.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [TokenManagerController],
  providers: [TokenManagerService],
})
export class TokenManagerModule {}
