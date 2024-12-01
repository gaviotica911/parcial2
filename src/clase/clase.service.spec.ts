import { Test, TestingModule } from '@nestjs/testing';
import { ClaseService } from './clase.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity/clase.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('ClaseService', () => {
  let service: ClaseService;
  let repository: Repository<ClaseEntity>;
  let clasesList: ClaseEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClaseService],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    repository = module.get<Repository<ClaseEntity>>(
      getRepositoryToken(ClaseEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    clasesList = [];
    for (let i = 0; i < 5; i++) {
      const clase: ClaseEntity = await repository.save({
        nombre: faker.book.genre(),
        codigo: faker.string.alphanumeric(10),
        numeroCreditos: faker.number.int({ min: 1, max: 5 }),
        bonos: [],
      });
      clasesList.push(clase);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new class', async () => {
    const clase: ClaseEntity = {
      id: '',
      nombre: faker.book.genre(),
      codigo: faker.string.alphanumeric(10),
      numeroCreditos: faker.number.int({ min: 1, max: 5 }),
      bonos: [],
      usuario: null,
    };

    const newClase: ClaseEntity = await service.create(clase);
    expect(newClase).not.toBeNull();

    const storedClase: ClaseEntity = await repository.findOne({
      where: { id: newClase.id },
    });
    expect(storedClase).not.toBeNull();
    expect(storedClase.nombre).toEqual(newClase.nombre);
    expect(storedClase.codigo).toEqual(newClase.codigo);
    expect(storedClase.numeroCreditos).toEqual(newClase.numeroCreditos);
  });

  it('findOne should return a class by id', async () => {
    const storedClase: ClaseEntity = clasesList[0];
    const clase: ClaseEntity = await service.findOne(storedClase.id);
    expect(clase).not.toBeNull();
    expect(clase.nombre).toEqual(storedClase.nombre);
    expect(clase.codigo).toEqual(storedClase.codigo);
    expect(clase.numeroCreditos).toEqual(storedClase.numeroCreditos);
  });

  it('findOne should throw an exception for an invalid id', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The clase with the given id was not found',
    );
  });

  it('create should throw an exception for an invalid code', async () => {
    const clase: ClaseEntity = {
      id: '',
      nombre: faker.book.genre(),
      codigo: faker.string.alphanumeric(7),
      numeroCreditos: faker.number.int({ min: 1, max: 5 }),
      bonos: [],
      usuario: null,
    };

    await expect(() => service.create(clase)).rejects.toHaveProperty(
      'message',
      'El código de la clase debe tener exactamente 10 caracteres.',
    );
  });
});
