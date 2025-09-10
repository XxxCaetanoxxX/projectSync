import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HashingModule } from 'src/hashing/hashing.module';
import { BucketSupabaseModule } from 'src/bucket_supabase/bucket_supabase.module';
import { EmailModule } from 'src/email/email.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/commom/strategies/google.strategy';

@Module({
  controllers: [UsersController],
  providers: [UsersService, GoogleStrategy],
  imports: [PrismaModule, HashingModule, BucketSupabaseModule, EmailModule, PassportModule],
  exports: [UsersService],
})
export class UsersModule { }
