import { OmitType } from '@nestjs/swagger';
import { LoginDto } from "./login.dto";

export class ForgotPasswordDto extends OmitType(LoginDto, ['password', 'phone']) { }  