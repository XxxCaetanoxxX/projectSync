import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllArtistsDto } from './dto/find-all-artists.dto';
import { PrismaExtendedService } from '../prisma/prisma-extended.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaExtendedService) { }
  async create(createArtistDto: CreateArtistDto) {
    const artist = await this.prisma.withAudit.tb_artist.create({ data: createArtistDto });
    return artist;
  }

  async findAll({ name, ...dto }: FindAllArtistsDto) {
    const res = await this.prisma.tb_artist.findMany({
      where: {
        ...dto,
        name: {
          contains: name
        }
      }
    });
    return res;
  }

  async findOne(id: number) {
    const artist = await this.prisma.tb_artist.findUniqueOrThrow({
      where: {
        id: id
      },
      include: {
        events: {
          include: {
            event: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
    return {
      id: artist.id,
      name: artist.name,
      events: artist.events.map(e => e.event)
    }
  }

  async update(id: number, { ...updateArtistDto }: UpdateArtistDto) {
    return await this.prisma.withAudit.tb_artist.update({
      where: {
        id
      },
      data: { ...updateArtistDto }
    })
  }

  async remove(id: number) {
    return await this.prisma.withAudit.tb_artist.delete({
      where: {
        id
      }
    })
  }
}
