import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, Min } from "class-validator";
import { CreateEventDto } from "./create-event.dto";

export class FindAllEventsDto extends PartialType(CreateEventDto){
    @ApiPropertyOptional({default: 10})
    @IsOptional()
    @Min(1)
    @Type(() => Number)
    take?: number = 10

    @ApiPropertyOptional({default: 0})
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    skip?: number = 0
}