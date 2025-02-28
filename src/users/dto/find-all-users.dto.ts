import { IsEnum, IsOptional, IsString } from "class-validator"
import { RolesEnum } from "src/commom/enums/roles.enum"

export class FindAllUsersDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsEnum(RolesEnum)
    @IsOptional()
    role?: RolesEnum
}