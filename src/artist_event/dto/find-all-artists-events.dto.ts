import { IsNumber, IsOptional } from "class-validator";

export class FindAllArtistsEventsDto {
    @IsOptional()
    @IsNumber()
    artistId?: number

    @IsOptional()
    @IsNumber()
    eventId?: number
}