import { Test, TestingModule } from '@nestjs/testing';
import { PartyHouseService } from './party_house.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PartyHouseService', () => {
  let service: PartyHouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartyHouseService, PrismaService],
    }).compile();

    service = module.get<PartyHouseService>(PartyHouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
