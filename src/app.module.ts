import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { TokenRoleGuard } from './commom/guards/token_role.guard';
import { EventModule } from './event/event.module';
import { PdfModule } from './pdf/pdf.module';
import { BucketSupabaseModule } from './bucket_supabase/bucket_supabase.module';
import { TicketModule } from './ticket/ticket.module';
import { EmailModule } from './email/email.module';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    EventModule,
    PdfModule,
    BucketSupabaseModule,
    TicketModule,
    EmailModule,
    BatchModule
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: TokenRoleGuard,
    }
  ],
})
export class AppModule { }
