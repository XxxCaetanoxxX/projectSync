import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { HashingModule } from './hashing/hashing.module';
import { TokenRoleGuard } from './commom/guards/token_role.guard';
import { EventModule } from './events/event.module';

@Module({
  imports: [UsersModule, PrismaModule, HashingModule, EventModule],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: TokenRoleGuard,
    }
  ],
})
export class AppModule {}
