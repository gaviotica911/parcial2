import { Test, TestingModule } from '@nestjs/testing';
import { ClaseBonoService } from './clase-bono.service';

describe('ClaseBonoService', () => {
  let service: ClaseBonoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClaseBonoService],
    }).compile();

    service = module.get<ClaseBonoService>(ClaseBonoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
