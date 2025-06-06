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
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FindAllTicketDto } from './dto/find-all-ticket.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { Roles } from '../commom/decorators/roles_decorator.decorator'
import { ApiResponseUtil } from 'src/commom/decorators/api-response-util.decorator';
import { BuyTicketSE, CreateTicketSE, FindAllEventTypesSE, FindAllTicketsSE, FindOneTicketSE, FindOneTypeSE, FindUserTicketsSE, UpdateTicketSE, UpdateTypeSE } from './tickets_swagger_exemple';
import { Public } from 'src/commom/decorators/public_decorator.decorator';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  //TYPES
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

  @Public()
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
  @Delete('type/:id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Delete ticket type.',
    example: { message: 'Ticket type deleted successfully!' }
  })
  deleteType(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.deleteType(id);
  }


  //TICKETS
  @Roles('PARTICIPANT', 'ORGANIZER', 'ADMIN')
  @Post('buy/:ticketTypeId')
  @ApiResponseUtil({
    status: 200,
    summary: 'Buy the ticket.',
    example: BuyTicketSE
  })
  buyTicket(@Param('ticketTypeId', ParseIntPipe) ticketTypeId: number, @Req() req: any) {
    return this.ticketService.buyTicket(ticketTypeId, req.user.id);
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
  @Get('/:id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Find one ticket.',
    example: FindOneTicketSE
  })
  findOneTicket(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.findOneTicket(id);
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
  @Delete(':id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Delete ticket.',
    example: { message: 'Ticket deleted successfully!' }
  })
  deleteTicket(@Param('id', ParseIntPipe) id: number) {
    return this.ticketService.deleteTicket(id);
  }
}