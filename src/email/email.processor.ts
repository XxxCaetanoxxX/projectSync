// email/email.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { TicketBoughtDto } from './dto/ticket-bought.dto';
import { EmailService } from './email.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
    constructor(private readonly emailService: EmailService) {
        super();
    }

    async process(job: any): Promise<void> {
        const dto = job.data as TicketBoughtDto;
        await this.emailService.ticketBoughtEmail(dto);
    }
}
