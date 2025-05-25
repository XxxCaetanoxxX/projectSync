import { PartialType } from '@nestjs/swagger';
import { BuyTicketDto } from './buy-ticket.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto extends PartialType(BuyTicketDto) {
    @IsString()
    @IsOptional()
    ticketName?: string
}
