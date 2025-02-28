import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PdfService } from '../pdf/pdf.service';

describe('EventService', () => {
  let service: EventService;
  let idCreatedEvent: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService, PrismaService, PdfService],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all events', async () => {
    const result = await service.findAll({});
    expect(result.length).toBeGreaterThan(0);
  });

  it('should find one event', async () => {
    const result = await service.findOne(1);
    expect(result).toMatchObject({ id: 1, name: 'ultimo baile do ano' });;
  });

  it('should find one event pdf', async () => {
    const result = await service.findOnePdf(1);
    expect(result).toEqual({ buffer: expect.any(Buffer), name: 'ultimo baile do ano.pdf' });
  });

  it('should create an event', async () => {
    const result = await service.create({
      name: 'Test event',
      partyHouseId: 1,
      organizerId: 1
    });
    idCreatedEvent = result.id;
    expect(result).toEqual({ id: result.id, name: 'Test event', organizerId: 1, partyHouseId: 1 });
  });

  it('should update an event', async () => {
    const artist = await service.findOne(idCreatedEvent);

    const updatedUser = await service.update(idCreatedEvent, {
      name: 'Test event update',
    });
    expect(artist.name).not.toEqual(updatedUser.name);
  });

  it('should delete event', async () => {
    await service.remove(idCreatedEvent);
    expect(service.findOne(idCreatedEvent)).rejects.toThrow(PrismaClientKnownRequestError);
  })
});