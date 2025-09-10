import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { FindAllArtistsDto } from './dto/find-all-artists.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateArtistSE, DeleteOneArtistSE, FindAllArtistSE, FindOneArtistSE, UpdateOneArtistSE } from './artist_swagger_exemple';

@ApiBearerAuth()
@Controller('artists')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) { }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create a new artist.',
    example: CreateArtistSE
  })
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @ApiResponse({
    status: 201,
    description: 'Find all artists.',
    example: FindAllArtistSE
  })
  findAll(@Query() findAllArtistsDto: FindAllArtistsDto) {
    return this.artistService.findAll(findAllArtistsDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 201,
    description: 'Find one artist.',
    example: FindOneArtistSE
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 201,
    description: 'Update an artist.',
    example: UpdateOneArtistSE
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete an artist.',
    example: DeleteOneArtistSE
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.artistService.remove(id);
  }
}
