import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async crearUsuario(usuario: UsuarioEntity): Promise<UsuarioEntity> {
    const rolValidos = ['Profesor', 'Decana'];

    if (!rolValidos.includes(usuario.rol)) {
      throw new BadRequestException(
        `El rol debe ser uno de los siguientes: ${rolValidos.join(', ')}`,
      );
    }
    if (usuario.rol === 'Profesor') {
      const gruposValidos = ['TICSW', 'IMAGINE', 'COMIT'];

      if (!gruposValidos.includes(usuario.grupoDeInvestigacion)) {
        throw new BadRequestException(
          `El grupo debe ser uno de los siguientes: ${gruposValidos.join(', ')}`,
        );
      }
    }
    if (usuario.rol === 'Decana') {
      if (
        !usuario.numeroExtension ||
        usuario.numeroExtension.toString().length !== 8
      ) {
        throw new BadRequestException(
          'El numero de extension de la decana debe tener exactamente 8 caracteres.',
        );
      }
    }

    // Guardar en la base de datos
    return await this.usuarioRepository.save(usuario);
  }

  async findOne(id: string): Promise<UsuarioEntity> {
    const usuario: UsuarioEntity = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['clases', 'bonos'],
    });
    if (!usuario)
      throw new BusinessLogicException(
        'The usuario with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return usuario;
  }

  async deleteUsuario(id: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['clases', 'bonos'],
    });

    if (!usuario) {
      throw new NotFoundException(`no existe un usuario con el id dado`);
    }

    // Validar si la propuesta tiene un proyecto asociado
    if (usuario.bonos.length > 0) {
      throw new BadRequestException(
        `El usuario no puede ser eliminado porque tiene asociado proyectos.`,
      );
    }

    if (usuario.rol === 'Decana') {
      throw new BadRequestException(`La decana no puede ser eliminada.`);
    }

    await this.usuarioRepository.remove(usuario);
  }
}
