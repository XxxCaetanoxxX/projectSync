import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { BucketSupabaseModule } from 'src/bucket_supabase/bucket_supabase.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PrismaModule, PdfModule, BucketSupabaseModule, UsersModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule { }
