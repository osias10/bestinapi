import { Test, TestingModule } from '@nestjs/testing';
import { BiosapiController } from './biosapi.controller';

describe('BiosapiController', () => {
  let controller: BiosapiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiosapiController],
    }).compile();

    controller = module.get<BiosapiController>(BiosapiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
