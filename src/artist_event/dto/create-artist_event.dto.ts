import { IsNumber } from "class-validator";

export class CreateArtistEventDto {
    @IsNumber()
    artistId: number;

    @IsNumber()
    eventId: number;
}
