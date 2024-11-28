import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioBonoService } from './usuario-bono.service';

describe('UsuarioBonoService', () => {
  let service: UsuarioBonoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioBonoService],
    }).compile();

    service = module.get<UsuarioBonoService>(UsuarioBonoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
