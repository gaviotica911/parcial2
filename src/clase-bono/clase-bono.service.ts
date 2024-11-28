import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonoEntity } from 'src/bono/bono.entity/bono.entity';
import { ClaseEntity } from 'src/clase/clase.entity/clase.entity';
import {
  BusinessError,
  BusinessLogicException,
} from 'src/shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class ClaseBonoService {
  constructor(
    @InjectRepository(ClaseEntity)
    private readonly ClaseRepository: Repository<ClaseEntity>,

    @InjectRepository(BonoEntity)
    private readonly BonoRepository: Repository<BonoEntity>,
  ) {}

  async findBonosByClase(ClaseId: string): Promise<BonoEntity[]> {
    const Clase = await this.ClaseRepository.findOne({
      where: { id: ClaseId },
      relations: ['Bonos'],
    });
    if (!Clase) {
      throw new BusinessLogicException(
        'The Clase with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }

    return Clase.bonos;
  }
}
