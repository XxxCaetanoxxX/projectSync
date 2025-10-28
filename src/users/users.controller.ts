import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, Req, UseInterceptors, UploadedFile, UseGuards, ParseFilePipeBuilder, HttpStatus, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/commom/decorators/public_decorator.decorator';
import { Roles } from 'src/commom/decorators/roles_decorator.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { CreateUserSE, DeleteUserSE, FindAllUsersSE, FindOneUserSE, FindUsersEventsSE, LoginSE, UpdateUserSE, UploadUserImageSE } from './users_swagger_exemples';
import { ApiResponseUtil } from 'src/commom/decorators/api-response-util.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot_password.dto';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { VerifyResetCodeDto } from './dto/verify_code.dto';
import { HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { RefreshTokenGuard } from 'src/commom/guards/refresh_token.guard';
import { SkipAuthGuard } from 'src/commom/decorators/skip_guard';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/login')
  @ApiResponseUtil({
    status: 200,
    summary: 'The user has been successfully logged in.',
    example: LoginSE
  })
  @Public()
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @SkipAuthGuard()
  @UseGuards(RefreshTokenGuard)
  @Roles('ADMIN', 'ORGANIZER', 'PARTICIPANT')
  @Post('refresh')
  async refresh(@Req() req: any) {
    const token = req.headers.authorization.split(' ')[1];
    return this.usersService.refreshToken(token, req.user.id);
  }

  @Post('logout')
  async logout(@Req() req) {
    return this.usersService.logout(req.user.id);
  }

  @Public()
  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {

  }

  @Public()
  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req
    // , @Res() res: Response
  ) {
    const token = await this.usersService.verifySocialLogin(req.user);
    return {
      message: 'Login realizado com sucesso!',
      token: token
    }
    // return res.redirect('https://www.youtube.com/')
    // TODO: redirecionar para url do frontend
  }

  @Public()
  @Post()
  @ApiResponseUtil({
    status: 201,
    summary: 'Create a new user.',
    example: CreateUserSE
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Post('send-email-forgot-password')
  @ApiResponseUtil({
    status: 201,
    summary: 'Send email to reset password.',
    example: {
      message: "Email send!"
    }
  })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.requestPasswordReset(forgotPasswordDto);
  }

  @Public()
  @Post('verify-reset-code')
  @HttpCode(200)
  @ApiResponseUtil({
    status: 200,
    summary: 'Verify password.',
    example: {
      message: "Code is valid"
    }
  })
  verifyResetCode(@Body() dto: VerifyResetCodeDto) {
    return this.usersService.verifyResetCode(dto);
  }

  @Public()
  @Patch('reset-password')
  @ApiResponseUtil({
    status: 200,
    summary: 'reset password.',
    example: {
      message: "Password reset successfully!"
    }
  })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.usersService.resetPassword(dto);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Get()
  @ApiResponseUtil({
    status: 200,
    summary: 'Find all users.',
    example: FindAllUsersSE
  })
  findAll(@Query() findAllUsersDto?: FindAllUsersDto) {
    return this.usersService.findAll(findAllUsersDto);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Get('/one')
  @ApiResponseUtil({
    status: 200,
    summary: 'Find one user.',
    example: FindOneUserSE
  })
  findOne(@Query() findOneUserDto: FindOneUserDto) {
    return this.usersService.findOne(findOneUserDto);
  }

  @Roles('ADMIN', 'ORGANIZER', 'PARTICIPANT')
  @Get('/me')
  @ApiResponseUtil({
    status: 200,
    summary: 'May found the logged user.',
    example: FindOneUserSE
  })
  findLoggedUser(@Req() req: any) {
    console.log(req.user)
    return this.usersService.findLoggedUser(req.user.id);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Patch(':id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Update the user.',
    example: UpdateUserSE
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }


  @UseInterceptors(FileInterceptor('userfile')) //nome do campo form-data que vai estar o arquivo no postman
  @Patch('upload/image')
  @ApiResponseUtil({
    status: 200,
    summary: 'Upload user image.',
    example: UploadUserImageSE
  })
  async updatePhoto(@UploadedFile(
    new ParseFilePipeBuilder().addFileTypeValidator({
      fileType: /jpeg|jpg|png/g,
    }).addMaxSizeValidator({
      maxSize: 5 * (1024 * 1024) //tamanho de 5 mb
    }).build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    })
  ) file: Express.Multer.File, @Req() req: any) {
    return await this.usersService.uploadAvatarImage(req.user.id, file);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Get('/event/:eventId')
  @ApiResponseUtil({
    status: 200,
    summary: 'get event participants.',
    example: FindUsersEventsSE
  })
  getEventParticipants(@Param('eventId', ParseIntPipe) eventId: number) {
    return this.usersService.getEventParticipants(eventId);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Delete(':id')
  @ApiResponseUtil({
    status: 200,
    summary: 'Delete the user.',
    example: DeleteUserSE
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.delete(id);
  }
}
