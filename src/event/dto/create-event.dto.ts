import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsString } from "class-validator";

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

    @ApiProperty()
    @IsDateString()
    dt_start: string

    @ApiProperty()
    @IsDateString()
    dt_end: string
}
