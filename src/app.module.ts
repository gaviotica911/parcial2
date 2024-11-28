import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { ClaseModule } from './clase/clase.module';
import { BonoModule } from './bono/bono.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseBonoService } from './clase-bono/clase-bono.service';
import { UsuarioBonoService } from './usuario-bono/usuario-bono.service';
import { UsuarioBonoController } from './usuario-bono/usuario-bono.controller';
import { ClaseBonoController } from './clase-bono/clase-bono.controller';

@Module({
  imports: [
    UsuarioModule,
    ClaseModule,
    BonoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'bonos',
      entities: [UsuarioModule, ClaseModule, BonoModule],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController, UsuarioBonoController, ClaseBonoController],
  providers: [AppService, ClaseBonoService, UsuarioBonoService],
})
export class AppModule {}
