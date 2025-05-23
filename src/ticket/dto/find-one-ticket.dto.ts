import { IsInt, IsOptional, IsString } from "class-validator";

export class FindOneTicketParams {
    @IsOptional()
    @IsInt()
    id?: number;

    @IsOptional()
    @IsString()
    ticketName?: string;
}