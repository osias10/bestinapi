import { Test, TestingModule } from '@nestjs/testing';
import { ApartService } from './apart.service';

describe('ApartService', () => {
  let service: ApartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApartService],
    }).compile();

    service = module.get<ApartService>(ApartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
