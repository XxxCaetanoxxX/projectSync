import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { BuyTicketDto } from './buy-ticket.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTicketDto extends PartialType(BuyTicketDto) {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    ticketName?: string
}
