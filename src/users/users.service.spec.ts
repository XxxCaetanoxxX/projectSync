import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../commom/enums/roles.enum';
import { PrismaService } from '../prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let id;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService, HashingService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be login', async () => {
    const loginDto = {
      email: 'caetano@gmail.com',
      password: 'dpmg123'
    };
    const result = await service.login(loginDto);
    expect(result).toBeDefined();
  });

  it('should be create user', async () => {
    const createUserDto:CreateUserDto = {
      name: 'Test user2',
      role: Roles.ADMIN,
      cpf: '7894564192',
      email: 'testuser2@gmail.com',
      password: 'dpmg123'
    };
    const result = await service.create(createUserDto);
    id = result.id;
    expect(Object.keys(result)).toEqual([
      'id', 
      'name', 
      'cpf', 
      'email', 
      'password', 
      'role', 
      'creation_date'
    ]);
  })

  it('should delete user', async () => {
    const result = await service.remove(id);
    expect(result).toBeDefined();
  })
});
