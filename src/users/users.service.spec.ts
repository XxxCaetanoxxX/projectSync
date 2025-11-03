import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaExtendedService } from '../prisma/prisma-extended.service';
import { RolesEnum } from '../commom/enums/roles.enum';
import * as bcrypt from 'bcryptjs';
import { BucketSupabaseService } from '../bucket_supabase/bucket_supabase.service';
import { EmailService } from '../email/email.service';

const prismaMock = {
  tb_user: {
    findFirst: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  withAudit: {
    tb_user: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
};

describe('UsersService (mocked)', () => {
  let service: UsersService;

  beforeAll(async ()=>{
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        BucketSupabaseService,
        EmailService,
        {
          provide: PrismaExtendedService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login successfully', async () => {
    const password = 'dpmg123';
    const passwordHash = await bcrypt.hash(password, 10);

    prismaMock.tb_user.findFirst.mockResolvedValue({
      id: 1,
      email: 'test@gmail.com',
      password: passwordHash,
    });

    const result = await service.login({
      email: 'test@gmail.com',
      password,
    });

    expect(result).toHaveProperty('accessToken');
    expect(prismaMock.tb_user.findFirst).toHaveBeenCalled();
  });

  it('should find one user', async () => {
    prismaMock.tb_user.findFirst.mockResolvedValue({
      id: 1,
      name: 'test user',
      email: 'test@gmail.com',
    });

    const result = await service.findOne({ id: 1 });

    expect(result.name).toBe('test user');
  });

  it('should create user', async () => {
    const newUser = {
      id: 2,
      name: 'Test user2',
      email: 'testuser2@gmail.com',
      cpf: '7894564192',
      phone: '5531997730631',
      password: 'hashed',
      role: RolesEnum.ADMIN,
      createdAt: new Date(),
      imageId: null,
    };

    prismaMock.withAudit.tb_user.create.mockResolvedValue(newUser);

    const result = await service.create({
      name: 'Test user2',
      role: RolesEnum.ADMIN,
      cpf: '7894564192',
      phone: '5531997730631',
      email: 'testuser2@gmail.com',
      password: 'dpmg123',
    });

    expect(result).toMatchObject(newUser);
    expect(prismaMock.withAudit.tb_user.create).toHaveBeenCalled();
  });

  it('should update user', async () => {
    const updated = { id: 1, name: 'Caetano' };
    prismaMock.withAudit.tb_user.update.mockResolvedValue(updated);

    const result = await service.update(1, { name: 'Caetano' });

    expect(result.data.name).toBe('Caetano');
    expect(prismaMock.withAudit.tb_user.update).toHaveBeenCalled();
  });

  it('should delete user', async () => {
    prismaMock.withAudit.tb_user.delete.mockResolvedValue({ id: 1 });

    const result = await service.delete(1);

    expect(result.message).toBe('User deleted successfully!');
    expect(prismaMock.withAudit.tb_user.delete).toHaveBeenCalled();
  });

  it('should find logged user', async () => {
    prismaMock.tb_user.findFirst.mockResolvedValue({
      id: 1,
      name: 'test user',
    });

    const result = await service.findLoggedUser(1);
    expect(result.name).toBe('test user');
  });
});
