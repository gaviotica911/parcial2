import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let usuariosList: UsuarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    usuariosList = [];
    for (let i = 0; i < 5; i++) {
      const usuario: UsuarioEntity = await repository.save({
        nombre: faker.person.fullName(),
        numeroCedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
        grupoDeInvestigacion: faker.helpers.arrayElement([
          'TICSW',
          'IMAGINE',
          'COMIT',
        ]),
        numeroExtension: faker.number.int({
          min: 10000000,
          max: 99999999,
        }),
        rol: faker.helpers.arrayElement(['Profesor']),
        clases: [],
        bonos: [],
      });
      usuariosList.push(usuario);
    }
  };

  it('create should return a new user', async () => {
    const usuario: UsuarioEntity = {
      id: '',
      nombre: faker.person.fullName(),
      numeroCedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
      grupoDeInvestigacion: faker.helpers.arrayElement([
        'TICSW',
        'IMAGINE',
        'COMIT',
      ]),
      numeroExtension: faker.number.int({
        min: 10000000,
        max: 99999999,
      }),
      rol: faker.helpers.arrayElement(['Profesor', 'Decana']),
      clases: [],
      bonos: [],
      jefe: usuariosList[0],
      subOrdinados: [],
    };

    const newUsuario: UsuarioEntity = await service.crearUsuario(usuario);
    expect(newUsuario).not.toBeNull();

    const storedUsuario: UsuarioEntity = await repository.findOne({
      where: { id: newUsuario.id },
    });
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.nombre).toEqual(newUsuario.nombre);
    expect(storedUsuario.numeroCedula).toEqual(newUsuario.numeroCedula);
    expect(storedUsuario.grupoDeInvestigacion).toEqual(
      newUsuario.grupoDeInvestigacion,
    );
    expect(storedUsuario.numeroExtension).toEqual(newUsuario.numeroExtension);
    expect(storedUsuario.rol).toEqual(newUsuario.rol);
  });

  it('findOne should return a user by id', async () => {
    const storedUsuario: UsuarioEntity = usuariosList[0];
    const usuario: UsuarioEntity = await service.findOne(storedUsuario.id);
    expect(usuario).not.toBeNull();
    expect(usuario.nombre).toEqual(storedUsuario.nombre);
    expect(usuario.numeroCedula).toEqual(storedUsuario.numeroCedula);
    expect(usuario.grupoDeInvestigacion).toEqual(
      storedUsuario.grupoDeInvestigacion,
    );
    expect(usuario.numeroExtension).toEqual(storedUsuario.numeroExtension);
    expect(usuario.rol).toEqual(storedUsuario.rol);
  });

  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The usuario with the given id was not found',
    );
  });

  it('Create should throw an exception for invalid group', async () => {
    const usuario: UsuarioEntity = {
      id: '',
      nombre: faker.person.fullName(),
      numeroCedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
      grupoDeInvestigacion: faker.person.jobArea(),
      numeroExtension: faker.number.int({
        min: 10000000,
        max: 99999999,
      }),
      rol: faker.helpers.arrayElement(['Profesor']),
      clases: [],
      bonos: [],
      jefe: usuariosList[0],
      subOrdinados: [],
    };

    await expect(() => service.crearUsuario(usuario)).rejects.toHaveProperty(
      'message',
      'El grupo debe ser uno de los siguientes: TICSW, IMAGINE, COMIT',
    );
  });

  it('delete should remove a user', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    await service.deleteUsuario(usuario.id);

    const deletedUsuario: UsuarioEntity = await repository.findOne({
      where: { id: usuario.id },
    });
    expect(deletedUsuario).toBeNull();
  });

  it('delete should throw an exception for an invalid Usuario', async () => {
    const usuario: UsuarioEntity = usuariosList[0];
    await service.deleteUsuario(usuario.id);
    await expect(() => service.deleteUsuario('0')).rejects.toHaveProperty(
      'message',
      'no existe un usuario con el id dado',
    );
  });
});
