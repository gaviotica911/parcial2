import { BonoEntity } from 'src/bono/bono.entity/bono.entity';
import { ClaseEntity } from 'src/clase/clase.entity/clase.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numeroCedula: number;

  @Column()
  nombre: string;
  @Column()
  grupoDeInvestigacion: string;

  @Column()
  numeroExtension: number;

  @Column()
  rol: string;

  @ManyToOne(() => UsuarioEntity, (subOrdinado) => subOrdinado.jefe)
  subOrdinados: UsuarioEntity;

  @OneToMany(() => UsuarioEntity, (jefe) => jefe.subOrdinados)
  jefe: UsuarioEntity[];

  @OneToMany(() => ClaseEntity, (clase) => clase.usuario)
  clases: ClaseEntity[];

  @OneToMany(() => BonoEntity, (bono) => bono.usuario)
  bonos: BonoEntity[];
}