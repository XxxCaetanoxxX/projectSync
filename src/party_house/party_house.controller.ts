import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { PartyHouseService } from './party_house.service';
import { CreatePartyHouseDto } from './dto/create-party_house.dto';
import { UpdatePartyHouseDto } from './dto/update-party_house.dto';
import { FindAllPartyHouseDto } from './dto/find-all-party-house.dto';
import { ApiResponse } from '@nestjs/swagger';
import { CreatePartyHouseSE, FindAllPartyHouseSE, FindOnePartyHouseSE, UpdatePartyHouseSE } from './party_house_swagger_exemples';

@Controller('party-house')
export class PartyHouseController {
  constructor(private readonly partyHouseService: PartyHouseService) { }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create a party house.',
    example: CreatePartyHouseSE
  })
  create(@Body() createPartyHouseDto: CreatePartyHouseDto) {
    return this.partyHouseService.create(createPartyHouseDto);
  }

  @Get()
  @ApiResponse({
    status: 201,
    description: 'Find all party house.',
    example: FindAllPartyHouseSE
  })
  findAll(@Query() findAllPartyHouseDto: FindAllPartyHouseDto) {
    return this.partyHouseService.findAll(findAllPartyHouseDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 201,
    description: 'Find a party house.',
    example: FindOnePartyHouseSE
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partyHouseService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 201,
    description: 'Update a party house.',
    example: UpdatePartyHouseSE
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePartyHouseDto: UpdatePartyHouseDto) {
    return this.partyHouseService.update(id, updatePartyHouseDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 201,
    description: 'Delete a party house.',
    example: FindOnePartyHouseSE
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partyHouseService.remove(id);
  }
}
