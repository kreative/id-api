import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import logger from '../utils/logger';

// configures and loads enviroment variables from .env file
dotenv.config();

// the port that the id-api should boot on
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // adds cross origin reference abilities
  // we have to add new domain names for each service that needs to access Kreative ID
  // this will change based on the env var "ENVIROMENT"
  app.enableCors({
    origin: [
      // http/https domains for localhost
      'http://localhost:3000',
      'https://localhost:3000',
      // http/https domains for id-client
      'http://id.kreativeusa.com',
      'https://id.kreativeusa.com',
      // http/https domains for hyperlink-client
      'http://kreativehyperlink.com',
      'https://kreativehyperlink.com',
      // http/https domains for hyperlink-api
      'http://api.kreativehyperlink.com',
      'https://api.kreativehyperlink.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  // removes any data from request bodies that don't fit the DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // adds /v1 before any route, used for API versioning
  app.setGlobalPrefix('/v1');

  logger.info(
    `id-api starting on port: ${PORT} enviroment: ${process.env.ENVIROMENT}`,
  );
  await app.listen(PORT);
}

logger.info(`id-api booting up... [${process.env.ENVIROMENT}]`);
console.log(`id-api booting up... port: ${process.env.PORT}`);
bootstrap();
