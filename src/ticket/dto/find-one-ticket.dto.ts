import { IsInt, IsOptional, IsString } from "class-validator";

export class FindOneTicketDto {
    @IsOptional()
    @IsInt()
    id?: number;

    @IsOptional()
    @IsString()
    ticketName?: string;
}