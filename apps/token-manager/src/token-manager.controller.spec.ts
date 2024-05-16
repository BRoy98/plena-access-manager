import { Test, TestingModule } from '@nestjs/testing';
import { TokenManagerController } from './token-manager.controller';
import { TokenManagerService } from './token-manager.service';

describe('TokenManagerController', () => {
  let tokenManagerController: TokenManagerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TokenManagerController],
      providers: [TokenManagerService],
    }).compile();

    tokenManagerController = app.get<TokenManagerController>(TokenManagerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tokenManagerController.getHello()).toBe('Hello World!');
    });
  });
});
