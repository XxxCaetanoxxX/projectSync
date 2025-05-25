import { IsString } from "class-validator";

export class TicketBoughtDto {
    @IsString()
    username: string;

    @IsString()
    ticketName: string;

    @IsString()
    eventName: string;

    @IsString()
    email: string
}