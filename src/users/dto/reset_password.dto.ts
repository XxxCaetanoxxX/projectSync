import { IsEmail, IsString } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    code: string;

    @IsString()
    newPassword: string;
}