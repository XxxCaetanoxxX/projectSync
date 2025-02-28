import { Test, TestingModule } from '@nestjs/testing';
import { PartyHouseService } from './party_house.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PartyHouseService', () => {
  let service: PartyHouseService;
  let createdPartyHouseId: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartyHouseService, PrismaService],
    }).compile();

    service = module.get<PartyHouseService>(PartyHouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all party houses', async () => {
    const result = await service.findAll({});
    expect(result.length).toBeGreaterThan(0);
  });

  it('should find one party house', async () => {
    const result = await service.findOne(1);
    expect(result).toMatchObject({ id: 1, name: 'star 415', address: 'Rua 1' });;
  });

  it('should create a party house', async () => {
    const result = await service.create({ name: 'chalezinho', address: 'Rua 3' });
    createdPartyHouseId = result.id;
    expect(Object.keys(result)).toEqual(['id', 'name', 'address']);
  });

  it('should update a party house', async () => {
    const partyHouse = await service.findOne(createdPartyHouseId);
    const result = await service.update(createdPartyHouseId, { name: 'chalezinho2' });
    expect(result.name).not.toEqual(partyHouse.name);
  });

  it('should delete party house', async () => {
    const result = await service.remove(createdPartyHouseId);
    expect(result).toBeDefined();
  })
});
