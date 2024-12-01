import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity/bono.entity';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';

@Injectable()
export class BonoService {
  constructor(
    @InjectRepository(BonoEntity)
    private readonly bonoRepository: Repository<BonoEntity>,

    @InjectRepository(ClaseEntity)
    private readonly claseRepository: Repository<ClaseEntity>,

    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async crearBono(bono: BonoEntity): Promise<BonoEntity> {
    const usuario = await this.bonoRepository.manager.findOne(UsuarioEntity, {
      where: { id: bono.usuario.id },
    });

    if (!usuario) {
      throw new BadRequestException('El usuario no existe');
    }

    if (usuario.rol !== 'Profesor') {
      throw new BadRequestException('El usuario debe ser un profesor');
    }
    if (bono.monto <= 0) {
      throw new BadRequestException('el monot debe ser mayor a 0');
    }
    bono.usuario = usuario;

    return await this.bonoRepository.save(bono);
  }

  async delete(id: string): Promise<void> {
    const bono = await this.bonoRepository.findOne({
      where: { id },
    });
    if (bono) {
      if (Number(bono.calificacion) > 4) {
        throw new BadRequestException(`EL bono no puede ser eliminado`);
      }
    } else {
      throw new NotFoundException(`El bono no existe`);
    }

    // Eliminar la propuesta si no tiene un proyecto asociado
    await this.bonoRepository.remove(bono);
  }
  async findBonoByCodigo(codigo: string): Promise<BonoEntity[]> {
    const clase = await this.claseRepository.findOne({ where: { codigo } });
    if (!clase) {
      throw new NotFoundException(`La clase  no existe`);
    }

    return await this.bonoRepository.find({
      where: { clase: { codigo } },
      relations: ['clase'],
    });
  }

  async findAllBonosByUsuario(userID: string): Promise<BonoEntity[]> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: userID },
    });
    if (!usuario) {
      throw new NotFoundException(`El usuario  no existe`);
    }

    // Buscar los bonos relacionados con el usuario
    return await this.bonoRepository.find({
      where: { usuario: { id: userID } },
      relations: ['usuario'],
    });
  }
}
