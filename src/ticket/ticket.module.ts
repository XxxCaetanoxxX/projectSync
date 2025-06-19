import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';
import { EmailQueueModule } from 'src/email_queue/email_queue.module';

@Module({
  imports: [PrismaModule, EmailModule, EmailQueueModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule { }
