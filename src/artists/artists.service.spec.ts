import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('ArtistsService', () => {
  let service: ArtistService;
  let idCreatedUser: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistService, PrismaService],
    }).compile();

    service = module.get<ArtistService>(ArtistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all artists', async () => {
    const result = await service.findAll({});
    expect(result.length).toBeGreaterThan(3);
  });

  it('should find one artist', async () => {
    const result = await service.findOne(1);
    expect(result).toMatchObject({ id: 1, name: 'Matue' });;
  });

  it('should create an artist', async () => {
    const result = await service.create({
      name: 'Test Artist',
    });
    idCreatedUser = result.id;
    expect(result).toEqual({ id: result.id, name: 'Test Artist' });
  });

  it('should update an artist', async () => {
    const artist = await service.findOne(idCreatedUser);

    const updatedUser = await service.update(idCreatedUser, {
      name: 'Test User update',
    });
    expect(artist.name).not.toEqual(updatedUser.name);
  });

  it('should delete artist', async () => {
    await service.remove(idCreatedUser);
    expect(service.findOne(idCreatedUser)).rejects.toThrow(PrismaClientKnownRequestError);
  })
});