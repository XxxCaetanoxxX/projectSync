import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { RolesEnum } from "src/commom/enums/roles.enum";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @Matches(/^\d{3}\d{3}\d{3}\d{2}$/, { message: 'o cpf deve seguir a máscara de 11 dígitos.' })
    @IsString()
    cpf: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @Matches(/^\d{2}\d{2}\d{9}$/, { message: 'O número de telefone deve possuir 13 digitos: 55 31 999999999)' })
    @IsString()
    phone: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty({ enum: RolesEnum })
    @IsEnum(RolesEnum)
    role: RolesEnum;
}
