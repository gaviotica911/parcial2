import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity/bono.entity';
import { BonoDto } from './bono.dto/bono.dto';

@Controller('bonos')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonoController {
  constructor(private readonly bonoService: BonoService) {}

  @Post()
  async create(@Body() bonoDto: BonoDto) {
    const bono: BonoEntity = plainToInstance(BonoEntity, bonoDto);
    return await this.bonoService.crearBono(bono);
  }
  @Get('clase/:cod')
  async findBonoByCodigo(@Param('cod') cod: string): Promise<BonoEntity[]> {
    return await this.bonoService.findBonoByCodigo(cod);
  }

  @Get('usuarios/:userID')
  async findAllBonosByUsuario(
    @Param('userID') userID: string,
  ): Promise<BonoEntity[]> {
    return await this.bonoService.findAllBonosByUsuario(userID);
  }

  @Delete(':bonoId')
  @HttpCode(204)
  async delete(@Param('bonoId') bonoId: string) {
    return await this.bonoService.delete(bonoId);
  }
}
