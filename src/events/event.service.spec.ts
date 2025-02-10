import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EventService', () => {
  let service: EventService;
  let prisma: PrismaService;  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventService, PrismaService],
    }).compile();

    service = module.get<EventService>(EventService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.only('should create event', async () => {
    const createEventDto = {
      name: 'Evento 1',
      description: 'Descrição do evento 1',
      date: new Date(),
      location: 'Local do evento 1',
      finished: false
    };
    const result = await service.create(createEventDto);
    console.log(result);
  })
});
