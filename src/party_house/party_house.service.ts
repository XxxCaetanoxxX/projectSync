import { Injectable } from '@nestjs/common';
import { CreatePartyHouseDto } from './dto/create-party_house.dto';
import { UpdatePartyHouseDto } from './dto/update-party_house.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FindAllPartyHouseDto } from './dto/find-all-party-house.dto';
import { PrismaExtendedService } from '../prisma/prisma-extended.service';

@Injectable()
export class PartyHouseService {
  constructor(private readonly prisma: PrismaExtendedService) { }
  async create({ ...createPartyHouseDto }: CreatePartyHouseDto) {
    const createdPartyHouse = await this.prisma.withAudit.tb_party_house.create({ data: { ...createPartyHouseDto } });
    return createdPartyHouse;
  }

  async findAll({ name, address, ...findAllPartyHouseDto }: FindAllPartyHouseDto) {
    return await this.prisma.tb_party_house.findMany({ where: { name: { contains: name }, address: { contains: address }, ...findAllPartyHouseDto } });
  }

  async findOne(id: number) {
    const partyHouse = await this.prisma.tb_party_house.findFirstOrThrow(
      {
        where: { id },
        select: {
          id: true,
          name: true,
          address: true,
          events: {
            select: {
              id: true,
              name: true,
              artists: {
                select: {
                  artist: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      }
    );

    return {
      id: partyHouse.id,
      name: partyHouse.name,
      address: partyHouse.address,
      events: partyHouse.events.map(event => ({
        id: event.id,
        name: event.name,
        artists: event.artists.map(artistEvent => ({
          id: artistEvent.artist.id,
          name: artistEvent.artist.name,
        })),
      })),
    }
  }

  async update(id: number, { ...updatePartyHouseDto }: UpdatePartyHouseDto) {
    return await this.prisma.withAudit.tb_party_house.update({ where: { id }, data: { ...updatePartyHouseDto } });
  }

  async remove(id: number) {
    return await this.prisma.withAudit.tb_party_house.delete({ where: { id } });
  }
}
