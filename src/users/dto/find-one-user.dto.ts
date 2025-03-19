import { ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsInt, IsOptional, IsString, ValidateIf } from "class-validator"

export class FindOneUserDto {
    @ApiPropertyOptional()
    @ValidateIf(o => !o.cpf && !o.email && !o.phone)
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    id?: number

    @ApiPropertyOptional()
    @ValidateIf(o => !o.id && !o.email && !o.phone)
    @IsString()
    @IsOptional()
    cpf?: string

    @ApiPropertyOptional()
    @ValidateIf(o => !o.id && !o.cpf && !o.phone)
    @IsString()
    @IsOptional()
    email?: string

    @ApiPropertyOptional()
    @ValidateIf(o => !o.id && !o.cpf && !o.email)
    @IsString()
    @IsOptional()
    phone?: string
}