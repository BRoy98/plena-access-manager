import { Test, TestingModule } from '@nestjs/testing';
import { AccessManagerController } from './access-manager.controller';
import { AccessManagerService } from './access-manager.service';

describe('AccessManagerController', () => {
  let accessManagerController: AccessManagerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccessManagerController],
      providers: [AccessManagerService],
    }).compile();

    accessManagerController = app.get<AccessManagerController>(AccessManagerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(accessManagerController.getHello()).toBe('Hello World!');
    });
  });
});
