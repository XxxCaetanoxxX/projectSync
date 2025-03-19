import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ArtistEventService } from './artist_event.service';
import { CreateArtistEventDto } from './dto/create-artist_event.dto';
import { UpdateArtistEventDto } from './dto/update-artist_event.dto';
import { ApiResponse } from '@nestjs/swagger';
import { CreateArtistEventSE, DeleteArtistEventSE } from './artist_event_swagger_exemple';

@Controller('artist-event')
export class ArtistEventController {
  constructor(private readonly artistEventService: ArtistEventService) { }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create a relation artist_event.',
    example: CreateArtistEventSE
  })
  create(@Body() createArtistEventDto: CreateArtistEventDto) {
    return this.artistEventService.create(createArtistEventDto);
  }

  // @Get()
  // findAll() {
  //   return this.artistEventService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.artistEventService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateArtistEventDto: UpdateArtistEventDto) {
  //   return this.artistEventService.update(+id, updateArtistEventDto);
  // }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete a relation artist_event.',
    example: DeleteArtistEventSE
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.artistEventService.remove(id);
  }
}
