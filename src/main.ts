import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Set up validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Set up views
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  
  // Set up static files
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Use cookie parser
  app.use(cookieParser());
  
  // Set up global prefix for API routes
  // app.setGlobalPrefix('api'); // Comment this out if it's causing issues with view routes
  
  await app.listen(3003);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
