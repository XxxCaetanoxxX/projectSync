import { IsBoolean, IsDate, IsDateString, IsString } from "class-validator";

export class CreateEventDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsDateString()
    date: Date;

    @IsString()
    location: string;

    @IsBoolean()
    finished: boolean;
}
