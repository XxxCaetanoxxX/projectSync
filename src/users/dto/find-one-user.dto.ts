import { Transform } from "class-transformer"
import { IsInt, IsOptional, IsString, ValidateIf, validate } from "class-validator"

export class FindOneUserDto {
    @ValidateIf(o => !o.cpf && !o.email && !o.phone)
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsInt()
    id?: number

    @ValidateIf(o => !o.id && !o.email && !o.phone)
    @IsString()
    @IsOptional()
    cpf?: string

    @ValidateIf(o => !o.id && !o.cpf && !o.phone)
    @IsString()
    @IsOptional()
    email?: string

    @ValidateIf(o => !o.id && !o.cpf && !o.email)
    @IsString()
    @IsOptional()
    phone?: string

}