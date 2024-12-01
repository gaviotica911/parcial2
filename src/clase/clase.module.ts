import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity/clase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseController } from './clase.controller';
import { BonoEntity } from 'src/bono/bono.entity/bono.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClaseEntity, BonoEntity, UsuarioEntity])],
  providers: [ClaseService],
  controllers: [ClaseController],
})
export class ClaseModule {}
