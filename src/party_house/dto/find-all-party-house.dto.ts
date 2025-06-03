import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class FindAllPartyHouseDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    address?: string

    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @Type(() => Number)
    skip: number = 0

    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @Type(() => Number)
    take: number = 10
}