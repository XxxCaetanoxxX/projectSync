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
import { datenow } from 'src/commom/utils/datenow';
import { ForgotPasswordDto } from './dto/forgot_password.dto';
import { EmailService } from 'src/email/email.service';
import { ResetPasswordDto } from './dto/reset_password.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaExtendedService,
    private readonly hashingService: HashingService,
    private readonly bucketSupabaseService: BucketSupabaseService,
    private readonly emailService: EmailService
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

  async requestPasswordReset({ email, ...dto }: ForgotPasswordDto) {
    const user = await this.prisma.tb_user.findFirst({ where: { email } });
    if (!user) throw new NotFoundException('User not found with the email provided!');

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRETY,
      {
        expiresIn: '15m'
      }
    );

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await this.emailService.sendForgotPasswordEmail(user.email, resetLink);

    return { message: 'Email sent to reset password!' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    //TODO: fazer exception filter de token expirado
    const decodedToken = jwt.verify(dto.token, process.env.JWT_SECRETY);

    const passwordHash = await this.hashingService.encrypt(dto.newPassword);

    const user = await this.prisma.tb_user.update({
      where: {
        id: decodedToken.id
      },
      data: {
        password: passwordHash
      }
    })

    return { message: 'Password reset successfully!' }
  }

  async findAll({ name, cpf, email, phone, skip, take, ...dto }: FindAllUsersDto) {
    return await this.prisma.tb_user.findMany({
      where: {
        cpf: {
          contains: cpf
        },
        email: {
          contains: email,
          mode: 'insensitive'
        },
        phone: {
          contains: phone
        },
        name: {
          contains: name
        },
        ...dto,
      },
      include: {
        image: {
          select: {
            id: true,
            path: true
          }
        }
      },
      skip,
      take
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


  async update(id: number, { password, ...updateUserDto }: UpdateUserDto) {
    let dataToUpdate: any = {
      nu_versao: { increment: 1 },
      ...updateUserDto,
    };

    //se tiver que atualizar a senha, adiciona em dados para atualizar
    if (password) {
      const passwordHash = await this.hashingService.encrypt(password);
      dataToUpdate.password = passwordHash;
    }

    const res = await this.prisma.withAudit.tb_user.update({
      where: { id },
      data: dataToUpdate,
    });

    return {
      message: "User updated!",
      data: res
    }
  }


  async delete(id: number) {
    const user = await this.prisma.withAudit.tb_user.delete({
      where: { id }
    });
    return { message: "User deleted successfully!", data: user }
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
