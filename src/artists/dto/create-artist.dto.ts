import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateArtistDto {
    @ApiProperty()
    @IsString()
    name: string
}
