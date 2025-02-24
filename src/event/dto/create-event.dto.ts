import { IsInt, IsString } from "class-validator";

export class CreateEventDto {
    @IsString()
    name: string

    @IsInt()
    organizerId: number

    @IsInt()
    partyHouseId: number
}
