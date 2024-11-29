import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ClaseBonoService } from 'src/clase-bono/clase-bono.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@Controller('clases/:cod/bonos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseBonoController {
  constructor(private readonly claseBonoService: ClaseBonoService) {}

  @Get()
  async findBonosByClase(@Param('cod') cod: string) {
    return await this.claseBonoService.findBonosByClase(cod);
  }
}
