import { IsString } from "class-validator";

export class CreatePartyHouseDto {
    @IsString()
    name: string;

    @IsString()
    address: string;
}
