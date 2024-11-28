import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UsuarioDto {
  @IsNumber()
  @IsNotEmpty()
  readonly numeroCedula: number;

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
  @IsString()
  @IsNotEmpty()
  readonly grupoDeInvestigacion: string;

  @IsNumber()
  @IsNotEmpty()
  readonly numeroExtension: number;

  @IsString()
  @IsNotEmpty()
  readonly rol: string;
}
