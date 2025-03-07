import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Res } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { responseFile } from 'src/commom/utils/response.file';
import { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import { CreateEventSE, DeleteEventSE, FindAllEventsSE, FindOneEventSE, UpdateEventSE } from './event_swagger_exemples';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Create the event.',
    example: CreateEventSE
  })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Return all events.',
    example: FindAllEventsSE
  })
  findAll(@Query() findAllEventsDto: FindAllEventsDto) {
    return this.eventService.findAll(findAllEventsDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Return one event.',
    example: FindOneEventSE
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.findOne(id);
  }

  @Get(':id/pdf')
  @ApiResponse({
    status: 200,
    description: 'Generete a pdf.',
  })
  async findOnePdf(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const { buffer, name } = await this.eventService.findOnePdf(id);
    responseFile({ file: buffer, filename: `${name}`, res, type: 'application/pdf' });
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Update the event.',
    example: UpdateEventSE
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Update the event.',
    example: DeleteEventSE
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.remove(id);
  }
}
