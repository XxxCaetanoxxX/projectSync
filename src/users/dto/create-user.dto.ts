import { Roles } from "src/commom/enums/roles.enum";

export class CreateUserDto {
    name: string;
    cpf: string;
    email: string;
    password: string;
    role: Roles;
}
