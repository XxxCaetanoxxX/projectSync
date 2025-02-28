import { IsEmail, IsEnum, IsPhoneNumber, IsString, MaxLength } from "class-validator";
import { RolesEnum } from "src/commom/enums/roles.enum";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    cpf: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsPhoneNumber('BR')
    @MaxLength(15)
    @IsString()
    phone: string;

    @IsString()
    password: string;

    @IsEnum(RolesEnum)
    role: RolesEnum;
}
