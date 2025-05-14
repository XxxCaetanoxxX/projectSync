import { Test, TestingModule } from '@nestjs/testing';
import { ArtistService } from './artist.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('ArtistsService', () => {
  let service: ArtistService;
  let prisma: PrismaService;
  let idCreatedUser: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistService, PrismaService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<ArtistService>(ArtistService);
  });

  beforeEach(async () => {
    const { id } = await prisma.tb_artist.create({
      data: {
        name: 'test artist'
      }
    })

    idCreatedUser = id
  });

  afterEach(async () => {
    try {
      await prisma.tb_artist.delete({
        where: {
          id: idCreatedUser
        }
      })
    }
    catch (_) { }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all artists', async () => {
    const result = await service.findAll({});
    expect(result.length).toBeGreaterThan(3);
  });

  it('should find one artist', async () => {
    const result = await service.findOne(idCreatedUser);
    expect(result).toMatchObject({ id: idCreatedUser, name: 'test artist' });;
  });

  it('should create an artist', async () => {
    const createdArtist = await service.create({
      name: 'Test Artist',
    });

    const findedArtist = await prisma.tb_artist.findUnique({
      where: {
        id: createdArtist.id
      }
    })

    await prisma.tb_artist.delete({
      where: {
        id: createdArtist.id
      }
    })

    expect(createdArtist).toEqual(findedArtist);
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