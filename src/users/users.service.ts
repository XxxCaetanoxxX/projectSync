import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService
  ) { }



  async login(loginDto: LoginDto) {
    const jwt = require('jsonwebtoken');
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email
      }
    })
    if (!user) throw new NotFoundException('User not found with the email!');
    const isValidPassword = await this.hashingService.compare(loginDto.password, user.password);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password!');

    return jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRETY, { expiresIn: '1h' });
  }

  async create({ password, ...createUserDto }: CreateUserDto) {
    const passwordHash = await this.hashingService.encrypt(password);
    return await this.prisma.user.create(
      {
        data: {
          ...createUserDto,
          password: passwordHash
        }
      }
    );
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id
      }
    });
  }

  async update(id: number, { ...updateUserDto }: UpdateUserDto) {
    return await this.prisma.user.update({
      where: {
        id
      },
      data: {
        ...updateUserDto
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
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
