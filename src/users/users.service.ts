import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
import { VerifyResetCodeDto } from './dto/verify_code.dto';
import { DateTime } from 'luxon';
import { AuthEnum } from 'src/commom/enums/auth.enum';
import { SocialUserDto } from './dto/social_user.dto';
import { RolesEnum } from 'src/commom/enums/roles.enum';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaExtendedService,
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
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password!');

    const tokens = this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  generateTokens(user: any) {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }

    const accessToken = jwt.sign({ ...payload, type: 'access' }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ ...payload, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: number, token: string) {
    const hashed = await bcrypt.hash(token, 10);
    await this.prisma.tb_user.update({
      where: {
        id: userId
      },
      data: {
        refresh_token: hashed
      }
    })
  }

  async refreshToken(token: string, userId: number) {
    try {
      const user = await this.prisma.tb_user.findUnique({ where: { id: userId } });
      if (!user || !user.refresh_token) throw new UnauthorizedException('Invalid refresh token');

      const isValid = await bcrypt.compare(token, user.refresh_token);
      if (!isValid) throw new UnauthorizedException('Invalid refresh token');

      const tokens = this.generateTokens(user);
      await this.saveRefreshToken(user.id, tokens.refreshToken);
      
      return tokens;
    } catch (err) {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }

  async logout(userId: number) {
    await this.prisma.tb_user.update({
      where: { id: userId },
      data: { refresh_token: null },
    });
    return { message: 'Logged out successfully' };
  }


  async create({ password, ...createUserDto }: CreateUserDto) {
    const passwordHash = await bcrypt.hash(password, 10);
    return await this.prisma.withAudit.tb_user.create(
      {
        data: {
          ...createUserDto,
          password: passwordHash,
          authType: AuthEnum.CREDENTIAL
        }
      }
    );
  }

  async requestPasswordReset({ email, ...dto }: ForgotPasswordDto) {
    const user = await this.prisma.tb_user.findFirst({ where: { email } });
    if (!user) throw new NotFoundException('User not found with the email provided!');

    if (user.authType != AuthEnum.CREDENTIAL) throw new BadRequestException('Users not registred with passwords can not request password reset!');

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // Gerar um código de 6 dígitos

    await this.prisma.tb_password_reset.create({
      data: {
        code,
        email,
        expiresAt: DateTime.now()
          .minus({ hours: 3 })     // subtrai 3 horas para adaptar ao horario do brasil
          .plus({ minutes: 15 })  // add 15 minutos para tempo de expiracao      
          .toJSDate(),
        createdAt: datenow()
      }
    })

    await this.emailService.sendForgotPasswordEmail(user.email, code);

    return { message: 'Code sent to registred email!' };
  }

  async verifyResetCode(dto: VerifyResetCodeDto) {
    const record = await this.prisma.tb_password_reset.findFirst({
      where: {
        email: dto.email,
        code: dto.code,
        used: false,
        expiresAt: { gte: datenow() },
      }
    });

    if (!record) throw new BadRequestException('Invalid or expired code');

    return { message: 'Code is valid' };
  }

  async resetPassword(dto: ResetPasswordDto) {

    const record = await this.prisma.tb_password_reset.findFirst({
      where: {
        email: dto.email,
        code: dto.code,
        used: false,
        expiresAt: { gte: datenow() }
      }
    });

    if (!record) throw new BadRequestException('Invalid or expired code');

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.$transaction(async (tx) => {

      await tx.tb_user.update({
        where: {
          email: dto.email
        },
        data: {
          password: passwordHash
        }
      });

      await tx.tb_password_reset.update({
        where: {
          id: record.id
        },
        data: {
          used: true
        }
      });
    });

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
      const passwordHash = await bcrypt.hash(password, 10);
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

  async verifySocialLogin({ email, firstName, lastName, picture, ...dto }: SocialUserDto) {
    let user = await this.prisma.tb_user.findUnique({
      where: {
        email,
      }
    })

    if (!user) {
      user = await this.prisma.$transaction(async (tx) => {
        const createdUser = await tx.tb_user.create({
          data: {
            name: `${firstName} ${lastName}`,
            email,
            role: RolesEnum.PARTICIPANT,
            authType: AuthEnum.GOOGLE,
            cpf: null,
            phone: null,
            password: null,
          },
        });

        const createdImage = await tx.tb_user_image.create({
          data: {
            userId: createdUser.id,
            path: picture,
          },
        });

        return await tx.tb_user.update({
          where: { id: createdUser.id },
          data: {
            imageId: createdImage.id,
          },
        });
      });
    }


    if (user.authType != AuthEnum.GOOGLE) {
      return new BadRequestException('Your login need password.')
    }

    const tokens = this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
