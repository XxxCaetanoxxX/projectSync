import { IsNumber, IsOptional } from "class-validator"

export class FindAllTicketDto {
    @IsOptional()
    @IsNumber()
    userId: number

    @IsOptional()
    @IsNumber()
    ticketTypeId: number
}