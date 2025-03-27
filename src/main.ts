import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './prisma/prisma-exception.filter';
import * as express from 'express';
import { join } from 'path';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API documentation')
    .setDescription('The project event API description')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  //usa filtro global
  app.useGlobalFilters(new PrismaExceptionFilter());

  //serve os arquivos estaticos da pasta 'files'
  app.use('/userfiles', express.static(join(process.cwd(), 'userfiles')));

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}
bootstrap();
