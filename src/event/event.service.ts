import { Injectable, Res } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { PdfService } from '../pdf/pdf.service';
import * as path from 'path';
import * as fs from 'node:fs/promises';
import { randomUUID } from 'crypto';



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
        party_house: true,
        images: {
          select: {
            id: true,
            path: true
          }
        }
      },
    });

    return {
      id: event.id,
      name: event.name,
      artists: event.artists.map(a => a.artist),
      images: event.images
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

  async uploadPhotos(eventId: number, files: Array<Express.Multer.File>) {

    const event = await this.findOne(eventId);


    files.forEach(async file => {
      //const mimiType = file.mimetype;
      const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
      const fileName = `${randomUUID()}.${fileExtension}`;
      const fileLocale = path.resolve(process.cwd(), 'eventfiles', fileName);

      await this.prisma.tb_event_image.create({
        data: {
          eventId: event.id,
          path: `${process.env.BASE_URL}/eventfiles/${fileName}`
        }
      })

      return await fs.writeFile(fileLocale, file.buffer);
    });

    return { message: "Images uploaded successfully" }
  }

  async update(id: number, { ...updateEventDto }: UpdateEventDto) {
    return await this.prisma.tb_event.update({ where: { id }, data: { ...updateEventDto } });
  }

  async remove(id: number) {
    return await this.prisma.tb_event.delete({ where: { id } });
  }
}
