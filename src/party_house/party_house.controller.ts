import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { PartyHouseService } from './party_house.service';
import { CreatePartyHouseDto } from './dto/create-party_house.dto';
import { UpdatePartyHouseDto } from './dto/update-party_house.dto';
import { FindAllPartyHouseDto } from './dto/find-all-party-house.dto';

@Controller('party-house')
export class PartyHouseController {
  constructor(private readonly partyHouseService: PartyHouseService) { }

  @Post()
  create(@Body() createPartyHouseDto: CreatePartyHouseDto) {
    return this.partyHouseService.create(createPartyHouseDto);
  }

  @Get()
  findAll(@Query() findAllPartyHouseDto: FindAllPartyHouseDto) {
    return this.partyHouseService.findAll(findAllPartyHouseDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partyHouseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePartyHouseDto: UpdatePartyHouseDto) {
    return this.partyHouseService.update(id, updatePartyHouseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partyHouseService.remove(id);
  }
}
