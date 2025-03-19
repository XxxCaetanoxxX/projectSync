import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/commom/decorators/public_decorator.decorator';
import { Roles } from 'src/commom/decorators/roles_decorator.decorator';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { CreateUserSE, DeleteUserSE, FindAllUsersSE, FindOneUserSE, LoginSE, UpdateUserSE } from './users_swagger_exemples';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/login')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    example: LoginSE
  })
  @Public()
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Public()
  @Post()
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    example: CreateUserSE
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'The users have been successfully found.',
    example: FindAllUsersSE
  })
  findAll(@Query() findAllUsersDto: FindAllUsersDto) {
    return this.usersService.findAll(findAllUsersDto);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Get('/one')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully found.',
    example: FindOneUserSE
  })
  findOne(@Query() findOneUserDto: FindOneUserDto) {
    return this.usersService.findOne(findOneUserDto);
  }

  @Roles('ADMIN', 'ORGANIZER', 'PARTICIPANT')
  @Get('/me')
  @ApiResponse({
    status: 200,
    description: 'May found the logged user.',
    example: FindOneUserSE
  })
  findLoggedUser(@Req() req: any) {
    return this.usersService.findLoggedUser(req.user.id);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    example: UpdateUserSE
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
    example: DeleteUserSE
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // @Post('/deletemany')
  // removeMany(@Query('name') name: string) {
  //   console.log(name);
  //   return this.usersService.removeMany(name);
  // }
}
