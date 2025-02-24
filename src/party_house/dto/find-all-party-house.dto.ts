import { IsOptional, IsString } from "class-validator";

export class FindAllPartyHouseDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    address?: string
}