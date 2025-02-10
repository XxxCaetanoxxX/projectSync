import { IsEmail, IsEnum, IsString } from "class-validator";
import { Roles } from "src/commom/enums/roles.enum";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    cpf: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(Roles)
    role: Roles;
}
