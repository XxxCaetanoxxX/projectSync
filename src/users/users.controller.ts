import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, Req, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
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
    status: 200,
    summary: 'Send emailto reset password.',
    example: {
      message: "Email send!"
    }
  })
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.requestPasswordReset(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.usersService.resetPassword(dto);
  }

  @Public()
  @Post('verify-reset-code')
  verifyResetCode(@Body() dto: VerifyResetCodeDto) {
    return this.usersService.verifyResetCode(dto);
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
