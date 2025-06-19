import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EmailProducerService {
    constructor(
        @Inject('EMAIL_SERVICE') private client: ClientProxy,
    ) { }

    async sendTicketBoughtEmail(payload: any) {
        await this.client.emit('ticket_bought_email', payload).toPromise();
    }
}
