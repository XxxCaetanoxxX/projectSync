import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Res } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { responseFile } from 'src/commom/utils/response.file';
import { Response } from 'express';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  findAll(@Query() findAllEventsDto: FindAllEventsDto) {
    return this.eventService.findAll(findAllEventsDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.findOne(id);
  }

  @Get(':id/pdf')
  async findOnePdf(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const {buffer, name } = await this.eventService.findOnePdf(id);
    responseFile({file: buffer, filename:`${name}`, res, type: 'application/pdf'});
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.remove(id);
  }
}
