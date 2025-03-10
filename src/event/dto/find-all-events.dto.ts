import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindAllEventsDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name?: string
}