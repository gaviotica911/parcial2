import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioController } from './usuario.controller';
import { BonoEntity } from 'src/bono/bono.entity/bono.entity';
import { ClaseEntity } from 'src/clase/clase.entity/clase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity, BonoEntity, ClaseEntity])],
  providers: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule {}
