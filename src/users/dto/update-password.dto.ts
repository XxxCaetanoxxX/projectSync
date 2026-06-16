import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
    @ApiProperty()
    @IsString()
    currentPassword: string;

    @ApiProperty()
    @IsString()
    @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres.' })
    newPassword: string;
}
