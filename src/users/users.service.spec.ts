import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesEnum } from '../commom/enums/roles.enum';
import { PrismaService } from '../prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BucketSupabaseService } from '../bucket_supabase/bucket_supabase.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  let idCreatedUser: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService, HashingService, BucketSupabaseService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    const { id } = await prisma.tb_user.create({
      data: {
        name: 'test user',
        role: RolesEnum.ADMIN,
        cpf: '4651849541564',
        phone: '5531996791636',
        email: 'testuser@gmail.com',
        password: 'dpmg123'
      }
    });
    idCreatedUser = id
  });

  afterEach(async () => {
    try {
      await prisma.tb_user.delete({
        where: {
          id: idCreatedUser
        }
      });
    } catch (_) { }
  })

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

  it('should find all users', async () => {
    const result = await service.findAll({});
    expect(result.length).toBeGreaterThan(2);
  })

  it('should find one user', async () => {
    const result = await service.findOne({ id: idCreatedUser });
    expect(result.name).toEqual('test user');
  })

  it('should be create user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test user2',
      role: RolesEnum.ADMIN,
      cpf: '7894564192',
      phone: '5531997730631',
      email: 'testuser2@gmail.com',
      password: 'dpmg123'
    };
    const result = await service.create(createUserDto);
    await prisma.tb_user.delete({ where: { id: result.id } });
    expect(Object.keys(result)).toEqual([
      'id',
      'name',
      'cpf',
      'email',
      'phone',
      'password',
      'role',
      'createdAt',
      'imageId'
    ]);
  })

  it('should update an user', async () => {
    const updateUserDto = {
      name: 'Caetano'
    };
    const result = await service.update(idCreatedUser, updateUserDto);
    expect(result.name).toEqual(updateUserDto.name);
  })

  it('should delete user', async () => {
    await service.remove(idCreatedUser);
    expect(prisma.tb_user.findUniqueOrThrow({ where: { id: idCreatedUser } })).rejects.toThrow(PrismaClientKnownRequestError);
  })

  it('should find logged user', async () => {
    const result = await service.findLoggedUser(idCreatedUser);
    expect(result.name).toEqual('test user');
  })
});