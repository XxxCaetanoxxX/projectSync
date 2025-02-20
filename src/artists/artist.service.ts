import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllArtistsDto } from './dto/find-all-artists.dto';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createArtistDto: CreateArtistDto) {
    const artist = await this.prisma.artist.create({ data: createArtistDto });
    return artist;
  }

  async findAll({ name, ...dto }: FindAllArtistsDto) {
    const res = await this.prisma.artist.findMany({
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
    const artist = await this.prisma.artist.findUniqueOrThrow({
      where: {
        id: id
      },
      include: {
        events: {
          include: {
            event:{
              select:{
                id: true,
                name: true
              }
            }
          }
        }
      }
    })
    return {
      id:artist.id,
      name:artist.name,
      events:artist.events.map(e => e.event)
    }
  }

  async update(id: number, { ...updateArtistDto }: UpdateArtistDto) {
    return await this.prisma.artist.update({
      where: {
        id
      },
      data: { ...updateArtistDto }
    })
  }

  async remove(id: number) {
    return await this.prisma.artist.delete({
      where: {
        id
      }
    })
  }
}
