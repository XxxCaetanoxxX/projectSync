import { Injectable } from '@nestjs/common';
import { CreateArtistEventDto } from './dto/create-artist_event.dto';
import { UpdateArtistEventDto } from './dto/update-artist_event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistEventService {
  constructor(private readonly prisma: PrismaService) { }
  async create(createArtistEventDto: CreateArtistEventDto) {
    const artist_event = await this.prisma.tb_artist_event.create({ data: createArtistEventDto });
    return artist_event;
  }

  // async findAll() {
  //   return await this.prisma.tb_artist_event.findMany();
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} artistEvent`;
  // }

  // update(id: number, updateArtistEventDto: UpdateArtistEventDto) {
  //   return `This action updates a #${id} artistEvent`;
  // }

  async remove(id: number) {
    return await this.prisma.tb_artist_event.delete({ where: { id } });
  }
}
