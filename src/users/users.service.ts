import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';
import { LoginDto } from './dto/login.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService
  ) { }



  async login(loginDto: LoginDto) {
    const { email, phone, password } = loginDto;

    const providedParams = [email, phone].filter(param => param);

    if (providedParams.length === 0) {
      throw new BadRequestException("You must provide an email OR a phone.");
    } else if (providedParams.length > 1) {
      throw new BadRequestException("You must provide either an email OR a phone, not both.");
    }

    const user = await this.prisma.tb_user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    })

    if (!user) throw new NotFoundException('User not found with the email or phone provided!');
    const isValidPassword = await this.hashingService.compare(password, user.password);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password!');

    return jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRETY, { expiresIn: '3h' });
  }

  async create({ password, ...createUserDto }: CreateUserDto) {
    const passwordHash = await this.hashingService.encrypt(password);
    return await this.prisma.tb_user.create(
      {
        data: {
          ...createUserDto,
          password: passwordHash
        }
      }
    );
  }

  async findAll({ name, ...dto }: FindAllUsersDto) {
    return await this.prisma.tb_user.findMany({
      where: {
        ...dto,
        name: {
          contains: name
        },
      }
    });
  }

  async findOne(findOneUserDto: FindOneUserDto) {
    const { id, cpf, email } = findOneUserDto;

    if (!id && !cpf && !email) {
      throw new BadRequestException("You must provide an id, a cpf or an email!");
    }

    const providedParams = [id, cpf, email].filter(param => param);

    if (providedParams.length !== 1) {
      throw new BadRequestException("You can only provide one parameter!");
    }

    return this.prisma.tb_user.findUniqueOrThrow({
      where: {
        id: id || undefined,
        cpf: cpf || undefined,
        email: email || undefined
      }
    });
  }


  async update(id: number, { ...updateUserDto }: UpdateUserDto) {
    return await this.prisma.tb_user.update({
      where: {
        id
      },
      data: {
        ...updateUserDto
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.tb_user.delete({
      where: { id }
    });
  }

  // async removeMany(name: string) {
  //   if(!name) throw new NotFoundException('Please, write a name!');
  //    const result = await this.prisma.user.deleteMany({
  //     where: {
  //       name:{
  //         contains: name
  //       }
  //     }
  //   });
  //   console.log(result);
  //   return {message: `${result.count} users deleted!`};
  // }
}
