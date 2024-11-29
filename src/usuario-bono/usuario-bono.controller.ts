import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UsuarioBonoService } from 'src/Usuario-bono/Usuario-bono.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';

@Controller('usuarios/:usuarioId/bonos')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioBonoController {
  constructor(private readonly usuarioBonoService: UsuarioBonoService) {}

  @Get()
  async findBonosByUsuario(@Param('usuarioId') usuarioId: string) {
    return await this.usuarioBonoService.findBonosByUsuario(usuarioId);
  }
}
