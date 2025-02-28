import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';
import { EventService } from '../event/event.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PdfService', () => {
  let service: PdfService;
  let eventService: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService, EventService, PrismaService],
    }).compile();

    eventService = module.get<EventService>(EventService);
    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate pdf', async () => {
    const event = await eventService.findOne(1);
    const result = await service.generatePdf(event);
    expect(result).toBeInstanceOf(Buffer);
  });
});
