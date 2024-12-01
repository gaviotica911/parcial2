import { BadRequestException, Injectable } from '@nestjs/common';
import { ClaseEntity } from './clase.entity/clase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ClaseService {
  constructor(
    @InjectRepository(ClaseEntity)
    private readonly claseRepository: Repository<ClaseEntity>,
  ) {}

  async create(clase: ClaseEntity): Promise<ClaseEntity> {
    // Validar que el código tenga exactamente 10 caracteres
    if (!clase.codigo || clase.codigo.length !== 10) {
      throw new BadRequestException(
        'El código de la clase debe tener exactamente 10 caracteres.',
      );
    }

    // Guardar el estudiante en la base de datos
    return await this.claseRepository.save(clase);
  }

  async findOne(id: string): Promise<ClaseEntity> {
    const clase: ClaseEntity = await this.claseRepository.findOne({
      where: { id },
      relations: ['bonos'],
    });
    if (!clase)
      throw new BusinessLogicException(
        'The clase with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return clase;
  }
}
