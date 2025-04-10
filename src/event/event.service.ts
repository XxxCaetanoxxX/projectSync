import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { PdfService } from '../pdf/pdf.service';
import * as path from 'path';
import * as fs from 'node:fs/promises';
import { randomUUID } from 'crypto';
import { BucketSupabaseService } from 'src/bucket_supabase/bucket_supabase.service';


@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService, private readonly pdfService: PdfService, private readonly bucketSupabaseService: BucketSupabaseService) { }
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
      },
      omit: {
        organizerId: true,
        partyHouseId: true
      },
      include: {
        party_house: {
          select: {
            name: true,
            address: true
          }
        },
        images: {
          select: {
            id: true,
            path: true
          }
        },
        organizer: {
          select: {
            id: true,
            name: true
          }
        }
      },
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
        party_house: {
          select: {
            name: true
          }
        },
        images: {
          select: {
            id: true,
            path: true
          }
        },
      },
    });

    return {
      id: event.id,
      name: event.name,
      party_house: event.party_house.name,
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

  async uploadImages(eventId: number, files: Array<Express.Multer.File>) {

    const event = await this.findOne(eventId);

    if (event.images.length >= 5) {
      throw new BadRequestException("The event already has 5 images!");
    } else if (files.length + event.images.length > 5) {
      throw new BadRequestException("The event can has a maximum of 5 images!");
    }

    const urls = await this.bucketSupabaseService.uploadEventImages(files, event.id);

    await this.prisma.tb_event_image.createMany({
      data: urls.map(url => ({
        eventId: event.id,
        path: url
      }))
    })

    return { message: "Images uploaded successfully" }
  }

  async deleteImage(imageId: number) {
    await this.prisma.tb_event_image.delete({ where: { id: imageId } });
    return { message: "Image deleted successfully!" }
  }

  async update(id: number, { ...updateEventDto }: UpdateEventDto) {
    return await this.prisma.tb_event.update({ where: { id }, data: { ...updateEventDto } });
  }

  async remove(id: number) {
    return await this.prisma.tb_event.delete({ where: { id } });
  }
}
