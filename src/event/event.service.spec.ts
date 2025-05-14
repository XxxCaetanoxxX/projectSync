import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PdfService } from '../pdf/pdf.service';
import { UsersService } from '../users/users.service';
import { BucketSupabaseService } from '../bucket_supabase/bucket_supabase.service';
import { HashingService } from '../hashing/hashing.service';

describe.only('EventService', () => {
  let service: EventService;
  let prisma: PrismaService;
  let createdEventId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService, PrismaService, PdfService, UsersService, BucketSupabaseService, HashingService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<EventService>(EventService);
  });

  beforeEach(async () => {
    const { id } = await prisma.tb_event.create({
      data: {
        name: 'test event',
        partyHouseId: 1,
        organizerId: 1
      }
    });
    createdEventId = id;
  });

  afterEach(async () => {
    try {
      await prisma.tb_event.delete({ where: { id: createdEventId } });
    } catch (_) { }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one event', async () => {
    const result = await service.findOne(createdEventId);
    expect(result).toMatchObject({ id: createdEventId, name: 'test event' });
  });

  it('should find all events', async () => {
    const result = await service.findAll({});
    expect(result.length).toBeGreaterThan(0);
  });


  it('should create an event', async () => {
    const created = await service.create({ name: 'new event', partyHouseId: 1 }, 1);

    await prisma.tb_event.delete({ where: { id: created.id } });

    expect(created).toEqual({
      id: created.id,
      name: 'new event',
      organizerId: 1,
      partyHouseId: 1,
    });
  });

  it('should update an event', async () => {
    const updated = await service.update(createdEventId, { name: 'updated' }, {
      id: 1,
      role: 'ORGANIZER',
    });
    expect(updated.name).toEqual('updated');
  });

  it('should delete event', async () => {
    await service.remove(createdEventId);
    await expect(service.findOne(createdEventId)).rejects.toThrow(PrismaClientKnownRequestError);
  });

  it('should find one event pdf', async () => {
    const result = await service.findOnePdf(createdEventId);
    expect(result).toEqual({ buffer: expect.any(Buffer), name: 'test event.pdf' });
  });
});
