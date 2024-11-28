import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity/bono.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BonoService {
  constructor(
    @InjectRepository(BonoEntity)
    private readonly bonoRepository: Repository<BonoEntity>,
  ) {}

  async crearBono(bono: BonoEntity): Promise<BonoEntity> {
    if (bono.monto <= 0) {
      throw new BadRequestException(`el monot debe ser mayor a 0`);
    }
    if (bono.usuario.rol !== 'Profesor') {
      throw new BadRequestException(`el usuario debe ser un profesor`);
    }

    // Guardar en la base de datos
    return await this.bonoRepository.save(bono);
  }

  async delete(id: string): Promise<void> {
    const bono = await this.bonoRepository.findOne({
      where: { id },
    });

    if (Number(bono.calificacion) > 4) {
      throw new BadRequestException(`EL bono no puede ser eliminado`);
    }

    // Eliminar la propuesta si no tiene un proyecto asociado
    await this.bonoRepository.remove(bono);
  }
}
