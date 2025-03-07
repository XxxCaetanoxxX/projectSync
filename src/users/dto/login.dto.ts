import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, IsString, Max, MaxLength, ValidateIf } from "class-validator";

export class LoginDto {
    @ApiPropertyOptional()
    @ValidateIf(o => !o.phone) // Valida apenas se phone não foi passado
    @IsString()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional()
    @ValidateIf(o => !o.email) // Valida apenas se email não foi passado
    @IsPhoneNumber('BR')
    @IsString()
    @IsOptional()
    @MaxLength(13)
    phone?: string;

    @ApiProperty()
    @IsString()
    password: string;
}