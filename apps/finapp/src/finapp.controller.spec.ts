import { Test, TestingModule } from '@nestjs/testing';
import { FinappController } from './finapp.controller';
import { FinappService } from './finapp.service';

describe('FinappController', () => {
  let finappController: FinappController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FinappController],
      providers: [FinappService],
    }).compile();

    finappController = app.get<FinappController>(FinappController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(finappController.getHello()).toBe('Hello World!');
    });
  });
});
