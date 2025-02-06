import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { HashingModule } from './hashing/hashing.module';

@Module({
  imports: [UsersModule, PrismaModule, HashingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
