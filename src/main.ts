import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv'
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}
bootstrap();
