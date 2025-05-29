import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { PdfService } from '../pdf/pdf.service';
import { BucketSupabaseService } from '../bucket_supabase/bucket_supabase.service';
import { UsersService } from '../users/users.service';
import { RolesEnum } from "../commom/enums/roles.enum";
import { PrismaExtendedService } from '../prisma/prisma-extended.service';



@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaExtendedService,
    private readonly pdfService: PdfService,
    private readonly bucketSupabaseService: BucketSupabaseService,
    private readonly usersService: UsersService
  ) { }

  async create({ ...createEventDto }: CreateEventDto, userId: number) {
    const user = await this.usersService.findOne({ id: userId });
    if (user.role === RolesEnum.PARTICIPANT) {
      await this.usersService.update(userId, { role: RolesEnum.ORGANIZER });
    }

    return await this.prisma.withAudit.tb_event.create({ data: { ...createEventDto, organizerId: userId } });
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
      organizerId: event.organizerId,
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

    const urls = await this.bucketSupabaseService.uploadEventImages(files);

    await this.prisma.tb_event_image.createMany({
      data: urls.map(url => ({
        eventId: event.id,
        path: url
      }))
    })

    return { message: "Images uploaded successfully" }
  }

  async deleteImage(imageId: number) {
    const image = await this.prisma.tb_event_image.findFirstOrThrow({
      where: { id: imageId },
      select: { path: true }
    })
    await this.bucketSupabaseService.deleteImageEvent(image.path);
    await this.prisma.tb_event_image.delete({ where: { id: imageId } });
    return { message: "Image deleted successfully!" }
  }

  async update(id: number, { ...updateEventDto }: UpdateEventDto, user: any) {
    const event = await this.findOne(id);
    if (event.organizerId !== user.id && user.role !== "ADMIN") {
      throw new BadRequestException("You are not allowed to update this event!");
    }

    return await this.prisma.withAudit.tb_event.update({ where: { id }, data: { ...updateEventDto } });
  }

  async delete(id: number) {
    return await this.prisma.withAudit.tb_event.delete({ where: { id } });
  }
}
