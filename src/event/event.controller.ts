import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Res, UseInterceptors, ParseFilePipeBuilder, HttpStatus, UploadedFiles, Req } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { responseFile } from 'src/commom/utils/response.file';
import { Response } from 'express';
import { CreateEventSE, DeleteEventSE, FindAllEventsSE, FindOneEventSE, UpdateEventSE } from './event_swagger_exemples';
import { Roles } from 'src/commom/decorators/roles_decorator.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiResponseUtil } from 'src/commom/decorators/api-response-util.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Roles('ADMIN', 'ORGANIZER', 'PARTICIPANT')
  @Post('create')
  @ApiResponseUtil({
    status: 201,
    summary: 'Create the event.',
    example: CreateEventSE
  })
  create(@Body() createEventDto: CreateEventDto, @Req() req: any) {
    return this.eventService.create(createEventDto, req.user.id);
  }

  @Get()
  @ApiResponseUtil({
    status: 200,
    summary: 'Return all events.',
    example: FindAllEventsSE
  })
  findAll(@Query() findAllEventsDto: FindAllEventsDto) {
    return this.eventService.findAll(findAllEventsDto);
  }

  @Get(':id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Return one event.',
    example: FindOneEventSE
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.findOne(id);
  }

  @Get(':id/pdf')
  @ApiResponseUtil({
    status: 200,
    summary: 'Generete a pdf.',
    example: { buffet: 'buffer' }
  })
  async findOnePdf(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const { buffer, name } = await this.eventService.findOnePdf(id);
    responseFile({ file: buffer, filename: `${name}`, res, type: 'application/pdf' });
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Patch(':id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Update the event.',
    example: UpdateEventSE
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto, @Req() req: any) {
    return this.eventService.update(id, updateEventDto, req.user);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @UseInterceptors(FilesInterceptor('eventfiles'))
  @ApiResponseUtil({
    status: 200,
    summary: 'Upload event images.',
    example: { message: 'Image updated successfully!' }
  })
  @Patch('upload/images/:eventId')
  async updatePhotos(@Param('eventId', ParseIntPipe) eventId: number, @UploadedFiles(
    new ParseFilePipeBuilder().addFileTypeValidator({
      fileType: /jpeg|jpg|png/g,
    }).addMaxSizeValidator({
      maxSize: 5 * (1024 * 1024)
    }).build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    })
  ) files: Array<Express.Multer.File>) {
    return await this.eventService.uploadImages(eventId, files);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Delete(':id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Delete the event.',
    example: DeleteEventSE
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventService.delete(id);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Delete('images/:imageId')
  @ApiResponseUtil({
    status: 200,
    summary: 'Delete the image.',
    example: { message: 'Image deleted successfully!' }
  })
  deleteImage(@Param('imageId', ParseIntPipe) imageId: number) {
    return this.eventService.deleteImage(imageId);
  }
}
