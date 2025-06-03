import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, MaxLength } from "class-validator";

export class CreateTicketTypeDto {
    @ApiProperty()
    @MaxLength(30)
    @IsString()
    name: string;

    @ApiProperty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsNumber()
    eventId: number
}