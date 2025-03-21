import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';
import { LoginDto } from './dto/login.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import * as fs from 'node:fs/promises';
import { randomUUID } from 'crypto';

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

    const providedParams = [id, cpf, email].filter(param => param);

    if (providedParams.length === 0) {
      throw new BadRequestException("You must provide an id, cpf, phone or an email!");
    } else if (providedParams.length > 1) {
      throw new BadRequestException("You can only provide one parameter!");
    }

    return this.prisma.tb_user.findFirst({
      where: {
        OR: [
          { id },
          { cpf },
          { email }
        ]
      }
    });
  }

  async findLoggedUser(id: number) {
    return await this.prisma.tb_user.findFirst({
      where: { id }
    })
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

  async uploadAvatarImage(id: number, file: Express.Multer.File) {
    try {

      const user = await this.findOne({ id });
      // const mimiType = file.mimetype;
      const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
      const fileName = `${user.name.toLowerCase().replace(' ', '')}_profile_photo.${fileExtension}`;
      const fileLocale = path.resolve(process.cwd(), 'files', fileName);
      await fs.writeFile(fileLocale, file.buffer);


      const updatedUser = await this.prisma.tb_user.update({
        where: { id: user.id },
        data: {
          photo: fileName
        },
        select: {
          id: true,
          name: true,
          email: true,
          photo: true
        }
      })

      return updatedUser
    } catch (error) {
      throw new Error(error);
    }

  }

  // async uploadAvatarImages(id: number, files: Array<Express.Multer.File>) {

  // }
}
