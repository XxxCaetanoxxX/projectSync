import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindAllArtistsDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name?: string
}