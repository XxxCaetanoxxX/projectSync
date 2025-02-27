import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv'
import { ValidationPipe } from '@nestjs/common';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  await app.listen(process.env.PORT ?? 3000, ()=>{
    console.log(`Server running on port ${process.env.PORT}`);
  });
}
bootstrap();
