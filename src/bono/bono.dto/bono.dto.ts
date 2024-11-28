import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Double } from 'typeorm';

export class BonoDto {
  @IsNumber()
  @IsNotEmpty()
  readonly monto: number;

  @IsNumber()
  @IsNotEmpty()
  readonly calificacion: Double;

  @IsString()
  @IsNotEmpty()
  readonly palabraClave: string;
}
