import { Test, TestingModule } from '@nestjs/testing';
import { ArtistEventController } from './artist_event.controller';
import { ArtistEventService } from './artist_event.service';

describe('ArtistEventController', () => {
  let controller: ArtistEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistEventController],
      providers: [ArtistEventService],
    }).compile();

    controller = module.get<ArtistEventController>(ArtistEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
