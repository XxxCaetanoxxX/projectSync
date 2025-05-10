import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FindAllTicketDto } from './dto/find-all-ticket.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { Roles } from '../commom/decorators/roles_decorator.decorator'
import { FindOneTicketDto } from './dto/find-one-ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  @Roles('PARTICIPANT', 'ORGANIZER', 'ADMIN')
  @Post('create')
  buyTicket(@Body() buyTicketDto: BuyTicketDto, @Req() req: any) {
    return this.ticketService.buyTicket(buyTicketDto, req.user.id);
  }

  @Roles('ORGANIZER', 'ADMIN')
  @Post('type/create')
  createType(@Body() createTicketTypeDto: CreateTicketTypeDto) {
    return this.ticketService.createType(createTicketTypeDto);
  }

  @Roles('PARTICIPANT', 'ORGANIZER', 'ADMIN')
  @Get('/me')
  findUserTickets(@Req() req: any) {
    return this.ticketService.findUserTickets(req.user.id);
  }

  @Roles('ORGANIZER', 'ADMIN')
  @Get('all')
  findAllTickets(@Query() findAllTicketDto?: FindAllTicketDto) {
    return this.ticketService.findAllTickets(findAllTicketDto);
  }

  @Roles('PARTICIPANT', 'ORGANIZER', 'ADMIN')
  @Get('types/:eventId')
  findAllTypes(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.ticketService.findAllTypes(eventId);
  }

  @Roles('PARTICIPANT', 'ORGANIZER', 'ADMIN')
  @Get('type/:id')
  findOneType(@Param('id', ParseIntPipe) ticketTypeId: number) {
    return this.ticketService.findOneType(ticketTypeId);
  }

  @Roles('PARTICIPANT', 'ORGANIZER', 'ADMIN')
  @Get(':id')
  findOneTicket(@Body() findOneTicketDto: FindOneTicketDto) {
    return this.ticketService.findOneTicket(findOneTicketDto);
  }

  @Roles('ORGANIZER', 'ADMIN')
  @Patch(':id')
  updateTicket(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.updateTicket(id, updateTicketDto);
  }

  @Roles('ORGANIZER', 'ADMIN')
  @Patch('type/:id')
  updateType(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketTypeDto: UpdateTicketTypeDto,
  ) {
    return this.ticketService.updateType(id, updateTicketTypeDto);
  }

  @Roles('ORGANIZER', 'ADMIN')
  @Delete(':id')
  deleteTicket(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.deleteTicket(id);
  }

  @Roles('ORGANIZER', 'ADMIN')
  @Delete('type/:id')
  deleteType(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.deleteType(id);
  }
}
