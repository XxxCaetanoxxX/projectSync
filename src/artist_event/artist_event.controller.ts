import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArtistEventService } from './artist_event.service';
import { CreateArtistEventDto } from './dto/create-artist_event.dto';
import { UpdateArtistEventDto } from './dto/update-artist_event.dto';

@Controller('artist-event')
export class ArtistEventController {
  constructor(private readonly artistEventService: ArtistEventService) {}

  @Post()
  create(@Body() createArtistEventDto: CreateArtistEventDto) {
    return this.artistEventService.create(createArtistEventDto);
  }

  @Get()
  findAll() {
    return this.artistEventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistEventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtistEventDto: UpdateArtistEventDto) {
    return this.artistEventService.update(+id, updateArtistEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artistEventService.remove(+id);
  }
}
