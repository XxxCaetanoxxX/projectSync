import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsPhoneNumber, IsString, MaxLength } from "class-validator";
import { RolesEnum } from "src/commom/enums/roles.enum";

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    cpf: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsPhoneNumber('BR')
    @MaxLength(13)
    @IsString()
    phone: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiProperty({ enum: RolesEnum })
    @IsEnum(RolesEnum)
    role: RolesEnum;
}
