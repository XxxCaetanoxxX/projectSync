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
import { ApiResponseUtil } from 'src/commom/decorators/api-response-util.decorator';
import { BuyTicketSE, CreateTicketSE, FindAllEventTypesSE, FindAllTicketsSE, FindOneTicketSE, FindOneTypeSE, FindUserTicketsSE, UpdateTicketSE, UpdateTypeSE } from './tickets_swagger_Exemple';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  @Roles('PARTICIPANT', 'ORGANIZER', 'ADMIN')
  @Post('create')
  @ApiResponseUtil({
    status: 200,
    summary: 'Buy the ticket.',
    example: BuyTicketSE
  })
  buyTicket(@Body() buyTicketDto: BuyTicketDto, @Req() req: any) {
    return this.ticketService.buyTicket(buyTicketDto, req.user.id);
  }

  @Roles('ORGANIZER', 'ADMIN')
  @Post('type/create')
  @ApiResponseUtil({
    status: 200,
    summary: 'Create ticket type.',
    example: CreateTicketSE
  })
  createType(@Body() createTicketTypeDto: CreateTicketTypeDto) {
    return this.ticketService.createType(createTicketTypeDto);
  }

  @Roles('PARTICIPANT', 'ORGANIZER', 'ADMIN')
  @Get('/me')
  @ApiResponseUtil({
    status: 200,
    summary: 'Find tickets from logged user.',
    example: FindUserTicketsSE
  })
  findUserTickets(@Req() req: any) {
    return this.ticketService.findUserTickets(req.user.id);
  }

  @Roles('ORGANIZER', 'ADMIN')
  @Get('all')
  @ApiResponseUtil({
    status: 200,
    summary: 'Find all tickets.',
    example: FindAllTicketsSE
  })
  findAllTickets(@Query() findAllTicketDto?: FindAllTicketDto) {
    return this.ticketService.findAllTickets(findAllTicketDto);
  }

  @Roles('PARTICIPANT', 'ORGANIZER', 'ADMIN')
  @Get('types/:eventId')
  @ApiResponseUtil({
    status: 200,
    summary: 'Find event ticket types.',
    example: FindAllEventTypesSE
  })
  findAllEventTypes(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.ticketService.findAllEventTypes(eventId);
  }

  @Roles('PARTICIPANT', 'ORGANIZER', 'ADMIN')
  @Get('type/:id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Find one ticket type.',
    example: FindOneTypeSE
  })
  findOneType(@Param('id', ParseIntPipe) ticketTypeId: number) {
    return this.ticketService.findOneType(ticketTypeId);
  }

  @Roles('PARTICIPANT', 'ORGANIZER', 'ADMIN')
  @Get(':id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Find one ticket.',
    example: FindOneTicketSE
  })
  findOneTicket(@Body() findOneTicketDto: FindOneTicketDto) {
    return this.ticketService.findOneTicket(findOneTicketDto);
  }

  @Roles('ORGANIZER', 'ADMIN')
  @Patch(':id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Update ticket.',
    example: UpdateTicketSE
  })
  updateTicket(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    return this.ticketService.updateTicket(id, updateTicketDto);
  }

  @Roles('ORGANIZER', 'ADMIN')
  @Patch('type/:id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Update ticket type.',
    example: UpdateTypeSE
  })
  updateType(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTicketTypeDto: UpdateTicketTypeDto,
  ) {
    return this.ticketService.updateType(id, updateTicketTypeDto);
  }

  @Roles('ORGANIZER', 'ADMIN')
  @Delete(':id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Update ticket type.',
    example: { message: 'Ticket deleted successfully!' }
  })
  deleteTicket(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.deleteTicket(id);
  }

  @Roles('ORGANIZER', 'ADMIN')
  @Delete('type/:id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Delete ticket type.',
    example: { message: 'Ticket type deleted successfully!' }
  })
  deleteType(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.deleteType(id);
  }
}