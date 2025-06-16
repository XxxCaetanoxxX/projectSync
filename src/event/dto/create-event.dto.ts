import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateEventDto {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsInt()
    partyHouseId: number

    @ApiProperty()
    @IsInt()
    nu_ingressos: number
}
