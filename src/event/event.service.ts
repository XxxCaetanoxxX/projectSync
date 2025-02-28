import { Injectable, Res } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { PdfService } from '../pdf/pdf.service';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService, private readonly pdfService: PdfService) { }
  async create({ ...createEventDto }: CreateEventDto) {
    const event = await this.prisma.tb_event.create({ data: { ...createEventDto } });
    return event
  }

  async findAll({ name, ...dto }: FindAllEventsDto) {
    return await this.prisma.tb_event.findMany({
      where: {
        ...dto,
        name: {
          contains: name
        }
      }
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.tb_event.findUniqueOrThrow({
      where: { id },
      include: {
        artists: {
          include: {
            artist: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        party_house: true
      }
    });

    return {
      id: event.id,
      name: event.name,
      artists: event.artists.map(a => a.artist)
    }
  }

  async findOnePdf(id: number) {
    const event = await this.prisma.tb_event.findUnique({
      where: { id: id },
      include: {
        party_house: true,
        artists: {
          include: { artist: true },
        },
      },
    });

    const eventData = {
      id: event.id,
      name: event.name,
      party_house: event.party_house,
      artists: event.artists.map(a => ({ id: a.artist.id, name: a.artist.name })),
    };

    const pdfBuffer = await this.pdfService.generatePdf(eventData);

    return {
      buffer: pdfBuffer,
      name: `${event.name}.pdf`,
    }
  }

  async update(id: number, { ...updateEventDto }: UpdateEventDto) {
    return await this.prisma.tb_event.update({ where: { id }, data: { ...updateEventDto } });
  }

  async remove(id: number) {
    return await this.prisma.tb_event.delete({ where: { id } });
  }
}
