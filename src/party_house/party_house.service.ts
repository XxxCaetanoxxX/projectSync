import { Injectable } from '@nestjs/common';
import { CreatePartyHouseDto } from './dto/create-party_house.dto';
import { UpdatePartyHouseDto } from './dto/update-party_house.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAllPartyHouseDto } from './dto/find-all-party-house.dto';

@Injectable()
export class PartyHouseService {
  constructor(private readonly prisma: PrismaService) { }
  async create({ ...createPartyHouseDto }: CreatePartyHouseDto) {
    const createdPartyHouse = await this.prisma.tb_party_house.create({ data: { ...createPartyHouseDto } });
    return createdPartyHouse;
  }

  async findAll({ name, address, ...findAllPartyHouseDto }: FindAllPartyHouseDto) {
    return await this.prisma.tb_party_house.findMany({ where: { name: { contains: name }, address: { contains: address }, ...findAllPartyHouseDto } });
  }

  async findOne(id: number) {
    return await this.prisma.tb_party_house.findFirstOrThrow({ where: { id } });
  }

  async update(id: number, { ...updatePartyHouseDto }: UpdatePartyHouseDto) {
    return await this.prisma.tb_party_house.update({ where: { id }, data: { ...updatePartyHouseDto } });
  }

  async remove(id: number) {
    return await this.prisma.tb_party_house.delete({ where: { id } });
  }
}
