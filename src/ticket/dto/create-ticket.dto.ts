import { IsNumber } from "class-validator"

export class CreateTicketDto {
    @IsNumber()
    ticketTypeId: number
    @IsNumber()
    userId: number
}
