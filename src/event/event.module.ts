import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { BucketSupabaseModule } from 'src/bucket_supabase/bucket_supabase.module';

@Module({
  imports: [PrismaModule, PdfModule, BucketSupabaseModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule { }
