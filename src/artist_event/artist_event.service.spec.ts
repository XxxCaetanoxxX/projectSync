import { Test, TestingModule } from '@nestjs/testing';
import { ArtistEventService } from './artist_event.service';

describe('ArtistEventService', () => {
  let service: ArtistEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtistEventService],
    }).compile();

    service = module.get<ArtistEventService>(ArtistEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
