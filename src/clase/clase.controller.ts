import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ClaseDto } from './clase.dto/clase.dto';
import { ClaseEntity } from './clase.entity/clase.entity';
import { plainToInstance } from 'class-transformer';
import { ClaseService } from './clase.service';

@Controller('clases')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}
  @Post()
  async create(@Body() claseDto: ClaseDto) {
    const clase: ClaseEntity = plainToInstance(ClaseEntity, claseDto);
    return await this.claseService.create(clase);
  }

  @Get(':claseId')
  async findOne(@Param('claseId') claseId: string) {
    return await this.claseService.findOne(claseId);
  }
}
