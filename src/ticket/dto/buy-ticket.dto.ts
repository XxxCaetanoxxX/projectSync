import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber } from "class-validator"

export class BuyTicketDto {
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    ticketTypeId: number

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    batchId: number
}
