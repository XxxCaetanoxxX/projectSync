import { IsOptional, IsString } from "class-validator";

export class FindAllArtistsDto {
    @IsString()
    @IsOptional()
    name?: string
}