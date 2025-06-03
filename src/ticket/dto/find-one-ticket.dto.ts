import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class FindOneTicketParams {
    @ApiProperty({required: false})
    @IsOptional()
    @IsInt()
    id?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    ticketName?: string;
}