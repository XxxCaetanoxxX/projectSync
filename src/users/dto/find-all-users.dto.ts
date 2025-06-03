import { ApiPropertyOptional, PartialType } from "@nestjs/swagger"
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"
import { RolesEnum } from "src/commom/enums/roles.enum"
import { CreateUserDto } from "./create-user.dto"
import { Type } from "class-transformer"

export class FindAllUsersDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name?: string

    @ApiPropertyOptional()
    @IsEnum(RolesEnum)
    @IsOptional()
    role?: RolesEnum

    @ApiPropertyOptional()
    @IsOptional()
    email?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    skip: number = 0

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    take: number = 15
}