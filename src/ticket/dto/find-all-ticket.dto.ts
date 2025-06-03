import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional } from "class-validator"

export class FindAllTicketDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)  
    userId?: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)  
    eventId?: number

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    ticketTypeId?: number

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    skip: number = 0

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    take:number = 10

    @ApiPropertyOptional()
    @IsOptional()
    ticketName?: string

    @ApiPropertyOptional()
    @IsOptional()
    eventName?: string

    @ApiPropertyOptional()
    @IsOptional()
    userName?: string

    @ApiPropertyOptional()
    @IsOptional()
    userEmail?: string
}