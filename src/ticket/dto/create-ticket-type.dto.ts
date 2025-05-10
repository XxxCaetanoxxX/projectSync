import { IsNumber, IsString, MaxLength } from "class-validator";

export class CreateTicketTypeDto {
    @MaxLength(30)
    @IsString()
    name: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;

    @IsNumber()
    eventId: number
}