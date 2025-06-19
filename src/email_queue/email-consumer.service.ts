import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TicketBoughtDto } from 'src/email/dto/ticket-bought.dto';
import { EmailService } from 'src/email/email.service';

@Controller()
export class EmailConsumerService {
    private readonly logger = new Logger(EmailConsumerService.name);

    constructor(private readonly emailService: EmailService) { }

    @EventPattern('ticket_bought_email')
    async handleTicketBought(@Payload() data: TicketBoughtDto) {
        this.logger.log(`Recebido pedido de envio de e-mail para ${data.email}`);
        await this.emailService.ticketBoughtEmail(data);
    }
}
