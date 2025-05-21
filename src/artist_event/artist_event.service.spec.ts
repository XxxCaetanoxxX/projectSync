import { Test, TestingModule } from '@nestjs/testing';
import { ArtistEventService } from './artist_event.service';
import { PrismaService } from '../prisma/prisma.service';

describe.skip('ArtistEventService', () => {
  let service: ArtistEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistEventService, PrismaService],
    }).compile();

    service = module.get<ArtistEventService>(ArtistEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
