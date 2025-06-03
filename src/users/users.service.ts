import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingService } from '../hashing/hashing.service';
import { LoginDto } from './dto/login.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import * as jwt from 'jsonwebtoken';
import { BucketSupabaseService } from '../bucket_supabase/bucket_supabase.service';
import { PrismaExtendedService } from '../prisma/prisma-extended.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaExtendedService,
    private readonly hashingService: HashingService,
    private readonly bucketSupabaseService: BucketSupabaseService
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

    return jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRETY);
  }

  async create({ password, ...createUserDto }: CreateUserDto) {
    const passwordHash = await this.hashingService.encrypt(password);
    return await this.prisma.withAudit.tb_user.create(
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
      },
      include: {
        image: {
          select: {
            id: true,
            path: true
          }
        }
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

    return await this.prisma.tb_user.findFirst({
      where: {
        OR: [
          { id },
          { cpf },
          { email }
        ]
      },
      omit: {
        imageId: true
      },
      include: {
        image: {
          select: {
            id: true,
            path: true
          }
        }
      }
    });
  }

  async findLoggedUser(id: number) {
    return await this.prisma.tb_user.findFirst({
      where: { id },
      include: {
        image: {
          select: {
            path: true
          }
        }
      }
    })
  }


  async update(id: number, { ...updateUserDto }: UpdateUserDto) {
    return await this.prisma.withAudit.tb_user.update({
      where: {
        id
      },
      data: {
        nu_versao: { increment: 1 },
        ...updateUserDto
      },
    });
  }

  async delete(id: number) {
    const user = await this.prisma.withAudit.tb_user.delete({
      where: { id }
    });
    return {message: "User deleted successfully!", data: user}
  }

  async uploadAvatarImage(id: number, file: Express.Multer.File) {
    try {

      const user = await this.findOne({ id });

      if (user.image) {
        await this.prisma.tb_user_image.delete({
          where: {
            id: user.image.id
          }
        })
      }

      const path = await this.bucketSupabaseService.uploadUserImage(file, user);

      const image = await this.prisma.tb_user_image.create({
        data: {
          userId: id,
          path
        }
      })

      const updatedUser = await this.prisma.tb_user.update({
        where: { id: user.id },
        data: {
          imageId: image.id
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      })

      return updatedUser
    } catch (error) {
      throw new InternalServerErrorException("Error to upload image!");
    }
  }

  async getEventParticipants(eventId: number) {
    const tickets = await this.prisma.tb_ticket.findMany({
      where: {
        ticket_type: {
          eventId
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    const participants = tickets.map(ticket => ticket.user);

    return {
      message: "Event participants found successfully!",
      data: participants
    }
  }
}
