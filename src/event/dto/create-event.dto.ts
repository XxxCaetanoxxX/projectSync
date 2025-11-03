import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsInt, IsString } from "class-validator";
import { EventEnum } from "src/commom/enums/event.enum";

export class CreateEventDto {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsInt()
    nu_ingressos: number

    @IsEnum(EventEnum)
    @ApiProperty()
    tp_evento: EventEnum

    @ApiProperty()
    @IsDateString()
    dt_start: string

    @ApiProperty()
    @IsDateString()
    dt_end: string
}
