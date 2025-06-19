import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmailProducerService } from './email.producer.service';
import { EmailModule } from 'src/email/email.module';
import { EmailConsumerService } from './email-consumer.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'EMAIL_SERVICE', //nome usado como token para injecao de dependencia
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'], //comunicacao amqp com rabbitmq
                    queue: 'email_queue', //nome da fila
                    queueOptions: {
                        durable: true,
                    },
                },
            },
        ]),
        EmailModule
    ],
    providers: [EmailProducerService, EmailConsumerService],
    exports: [EmailProducerService, EmailConsumerService],
})
export class EmailQueueModule { }
