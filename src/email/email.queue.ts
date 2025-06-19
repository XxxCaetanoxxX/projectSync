import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { TicketBoughtDto } from './dto/ticket-bought.dto';

@Injectable()
export class EmailQueue {
    constructor(
        @InjectQueue('email') private readonly emailQueue: Queue, //injeta a fila de emails
    ) { }

    async addTicketBoughtEmail(dto: TicketBoughtDto) {
        await this.emailQueue.add('ticket_bought_email', dto); //adiciona o envio de email na fila
    }
}
