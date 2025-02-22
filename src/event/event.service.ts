import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllEventsDto } from './dto/find-all-events.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createEventDto: CreateEventDto) {
    const event = await this.prisma.event.create({ data: createEventDto });
    return event
  }

  async findAll({ name, ...dto }: FindAllEventsDto) {
    return await this.prisma.event.findMany({
      where: {
        ...dto,
        name: {
          contains: name
        }
      }
    });
  }

  async findOne(id: number) {
    const event = await this.prisma.event.findUniqueOrThrow({
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
        }
      }
    });
    return {
      id: event.id,
      name: event.name,
      artists: event.artists.map(a => a.artist)
    }
  }

  async update(id: number, { ...updateEventDto }: UpdateEventDto) {
    return await this.prisma.event.update({ where: { id }, data: { ...updateEventDto } });
  }

  async remove(id: number) {
    return await this.prisma.event.delete({ where: { id } });
  }
}
