import { PartialType } from '@nestjs/swagger';
import { BuyTicketDto } from './buy-ticket.dto';

export class UpdateTicketDto extends PartialType(BuyTicketDto) { }
