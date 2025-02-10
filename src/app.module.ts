import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { HashingModule } from './hashing/hashing.module';
import { TokenRoleGuard } from './commom/guards/token_role.guard';

@Module({
  imports: [UsersModule, PrismaModule, HashingModule],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: TokenRoleGuard,
    }
  ],
})
export class AppModule {}
