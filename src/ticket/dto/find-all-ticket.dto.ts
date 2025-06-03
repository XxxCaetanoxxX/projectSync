import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsNumber, IsOptional } from "class-validator"

export class FindAllTicketDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    userId?: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    ticketTypeId?: number
}