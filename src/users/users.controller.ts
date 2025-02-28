import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/commom/decorators/public_decorator.decorator';
import { Roles } from 'src/commom/decorators/roles_decorator.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { FindOneUserDto } from './dto/find-one-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/login')
  @Public()
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Get()
  findAll(@Query() findAllUsersDto: FindAllUsersDto) {
    return this.usersService.findAll(findAllUsersDto);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Get('/one')
  findOne(@Query() findOneUserDto: FindOneUserDto) {
    return this.usersService.findOne(findOneUserDto);
  }

  @Roles('ADMIN', 'ORGANIZER')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Public()
  @UseInterceptors(FileInterceptor('file')) //nome do campo form-data que vai estar o arquivo no postman
  @Patch('image/:id')
  async updatePhoto(@Param('id', ParseIntPipe) id: number, @UploadedFile() file: Express.Multer.File) {
    //const mimiType = file.mimetype;
    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
    const fileName = `${id}.${fileExtension}`;
    const fileLocale = path.resolve(process.cwd(), 'files', fileName);
    await fs.writeFile(fileLocale, file.buffer);
    return true
  }

  @Public()
  @UseInterceptors(FilesInterceptor('files'))
  @Patch('images/:id')
  async updatePhotos(@Param('id', ParseIntPipe) id: number, @UploadedFiles() files: Array<Express.Multer.File>) {
    files.forEach(async file => {
      //const mimiType = file.mimetype;
      const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
      const fileName = `${randomUUID()}.${fileExtension}`;
      const fileLocale = path.resolve(process.cwd(), 'files', fileName);

      await fs.writeFile(fileLocale, file.buffer);
    });
    return true
  }


  @Roles('ADMIN', 'ORGANIZER')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // @Post('/deletemany')
  // removeMany(@Query('name') name: string) {
  //   console.log(name);
  //   return this.usersService.removeMany(name);
  // }
}
