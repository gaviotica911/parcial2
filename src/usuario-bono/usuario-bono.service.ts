import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonoEntity } from 'src/bono/bono.entity/bono.entity';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { UsuarioEntity } from 'src/usuario/usuario.entity/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioBonoService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly UsuarioRepository: Repository<UsuarioEntity>,

    @InjectRepository(BonoEntity)
    private readonly BonoRepository: Repository<BonoEntity>,
  ) {}

  async findBonosByUsuario(UsuarioId: string): Promise<BonoEntity[]> {
    const Usuario = await this.UsuarioRepository.findOne({
      where: { id: UsuarioId },
      relations: ['Bonos'],
    });
    if (!Usuario) {
      throw new BusinessLogicException(
        'The Usuario with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return Usuario.bonos;
  }
}
