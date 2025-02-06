import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";

export class LoginDto {
    email: string;
    password: string;
}