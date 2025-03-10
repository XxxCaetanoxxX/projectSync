import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { RolesEnum } from "src/commom/enums/roles.enum"

export class FindAllUsersDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name?: string

    @ApiPropertyOptional()
    @IsEnum(RolesEnum)
    @IsOptional()
    role?: RolesEnum
}