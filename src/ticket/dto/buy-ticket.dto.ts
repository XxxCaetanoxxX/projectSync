import { IsNumber } from "class-validator"

export class BuyTicketDto {
    @IsNumber()
    ticketTypeId: number
    @IsNumber()
    userId: number
}
