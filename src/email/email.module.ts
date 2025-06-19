import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { EmailQueue } from './email.queue';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'email' }),
  ],
  providers: [EmailService, EmailProcessor, EmailQueue],
  exports: [EmailService, EmailQueue],
})
export class EmailModule { }
