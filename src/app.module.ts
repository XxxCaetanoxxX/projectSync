import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { HashingModule } from './hashing/hashing.module';
import { TokenGuard } from './commom/guards/token.guard.guard';

@Module({
  imports: [UsersModule, PrismaModule, HashingModule],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: TokenGuard,
    }
  ],
})
export class AppModule {}
