import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //configuração para filas no rabbitmq
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'email_queue',
      queueOptions: {
        durable: true
      },
    }
  });

  await app.startAllMicroservices();

  //configuracao swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API documentation')
    .setDescription('The project event API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory);

  //ativacao CORS
  app.enableCors();

  //remove qualquer propriedade nao permitida pelo DTO
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  //usa filtro global
  app.useGlobalFilters(new PrismaExceptionFilter());

  //porta da aplicacao
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}
bootstrap();
