import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity/bono.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoController } from './bono.controller';
import { ClaseEntity } from 'src/clase/clase.entity/clase.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BonoEntity, ClaseEntity, UsuarioEntity])],
  providers: [BonoService],
  controllers: [BonoController],
})
export class BonoModule {}
