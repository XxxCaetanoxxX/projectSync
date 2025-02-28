import { Transform } from "class-transformer"
import { IsInt, IsOptional, IsString } from "class-validator"

export class FindOneUserDto {
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    id?: number

    @IsString()
    @IsOptional()
    cpf?: string

    @IsString()
    @IsOptional()
    email?: string

}