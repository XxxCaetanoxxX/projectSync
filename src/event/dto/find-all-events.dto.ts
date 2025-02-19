import { IsOptional, IsString } from "class-validator";

export class FindAllEventsDto {
    @IsString()
    @IsOptional()
    name?: string
}