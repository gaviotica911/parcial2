import { Test, TestingModule } from '@nestjs/testing';
import { BonoService } from './bono.service';
import { Repository } from 'typeorm';
import { BonoEntity } from './bono.entity/bono.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('BonoService', () => {
  let service: BonoService;
  let bonoRepository: Repository<BonoEntity>;
  let claseRepository: Repository<ClaseEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let usuario: UsuarioEntity;
  let clase: ClaseEntity;
  let bonosList: BonoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonoService],
    }).compile();

    service = module.get<BonoService>(BonoService);
    bonoRepository = module.get<Repository<BonoEntity>>(
      getRepositoryToken(BonoEntity),
    );
    claseRepository = module.get<Repository<ClaseEntity>>(
      getRepositoryToken(ClaseEntity),
    );
    usuarioRepository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await bonoRepository.clear();
    await claseRepository.clear();
    await usuarioRepository.clear();

    usuario = await usuarioRepository.save({
      nombre: faker.person.fullName(),
      numeroCedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
      grupoDeInvestigacion: 'TICSW',
      numeroExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Profesor',
      clases: [],
      bonos: [],
    });

    clase = await claseRepository.save({
      nombre: faker.book.genre(),
      codigo: faker.string.alphanumeric(10),
      numeroCreditos: faker.number.int({ min: 1, max: 5 }),
      usuario: usuario,
      bonos: [],
    });

    bonosList = [];
    for (let i = 0; i < 5; i++) {
      const bono = await bonoRepository.save({
        monto: faker.number.int({ min: 100, max: 1000 }),
        calificacion: faker.number.float({ min: 1, max: 5 }),
        palabraClave: faker.word.adjective(),
        usuario: usuario,
        clase: clase,
      });
      bonosList.push(bono);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearBono', () => {
    it('should create a new bono', async () => {
      const bono: BonoEntity = {
        id: '',
        monto: 500,
        calificacion: 4.5,
        palabraClave: 'Excelente',
        usuario: usuario,
        clase: clase,
      };

      const newBono = await service.crearBono(bono);
      expect(newBono).not.toBeNull();
      const storedBono = await bonoRepository.findOne({
        where: { id: newBono.id },
      });
      expect(storedBono).not.toBeNull();
      expect(storedBono.monto).toEqual(bono.monto);
      expect(storedBono.calificacion).toEqual(bono.calificacion);
    });

    it('should throw an exception if usuario does not exist', async () => {
      const bono: BonoEntity = {
        id: '',
        monto: 500,
        calificacion: 4.5,
        palabraClave: 'Excelente',
        usuario: { ...usuario, id: '0' },
        clase: clase,
      };

      await expect(() => service.crearBono(bono)).rejects.toHaveProperty(
        'message',
        'El usuario no existe',
      );
    });

    it('should throw an exception if monto is less than or equal to 0', async () => {
      const bono: BonoEntity = {
        id: '',
        monto: 0,
        calificacion: 4.5,
        palabraClave: 'Excelente',
        usuario: usuario,
        clase: clase,
      };

      await expect(() => service.crearBono(bono)).rejects.toHaveProperty(
        'message',
        'el monot debe ser mayor a 0',
      );
    });
  });

  describe('delete', () => {
    it('should delete a bono', async () => {
      const bono = bonosList[0];
      await service.delete(bono.id);
      const deletedBono = await bonoRepository.findOne({
        where: { id: bono.id },
      });
      expect(deletedBono).toBeNull();
    });

    it('should throw an exception if bono does not exist', async () => {
      await expect(() => service.delete('0')).rejects.toHaveProperty(
        'message',
        'El bono no existe',
      );
    });

    it('should throw an exception if bono has calificacion > 4', async () => {
      const bono = bonosList[0];
      bono.calificacion = 4.5;
      await bonoRepository.save(bono);

      await expect(() => service.delete(bono.id)).rejects.toHaveProperty(
        'message',
        'EL bono no puede ser eliminado',
      );
    });
  });

  describe('findBonoByCodigo', () => {
    it('should return bonos by clase codigo', async () => {
      const bonos = await service.findBonoByCodigo(clase.codigo);
      expect(bonos).not.toBeNull();
      expect(bonos).toHaveLength(bonosList.length);
    });

    it('should throw an exception if clase does not exist', async () => {
      await expect(() => service.findBonoByCodigo('0')).rejects.toHaveProperty(
        'message',
        'La clase  no existe',
      );
    });
  });

  describe('findAllBonosByUsuario', () => {
    it('should return bonos by usuario id', async () => {
      const bonos = await service.findAllBonosByUsuario(usuario.id);
      expect(bonos).not.toBeNull();
      expect(bonos).toHaveLength(bonosList.length);
    });

    it('should throw an exception if usuario does not exist', async () => {
      await expect(() =>
        service.findAllBonosByUsuario('0'),
      ).rejects.toHaveProperty('message', 'El usuario  no existe');
    });
  });
});
