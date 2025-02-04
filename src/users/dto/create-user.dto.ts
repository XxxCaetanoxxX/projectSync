import { Roles } from "src/commom/enums";

export class CreateUserDto {
    name: string;
    cpf: string;
    email: string;
    password: string;
    role: Roles;
}
