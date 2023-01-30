import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from "helmet";
import logger from '../utils/logger';

// configures and loads enviroment variables from .env file
dotenv.config();

// the port that the id-api should boot on
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  // adds cross origin reference abilities
  // we have to add new domain names for each service that needs to access Kreative ID
  app.enableCors({
    allowedHeaders: ["KREATIVE_ID_KEY", "KREATIVE_AIDN"],
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
      'http://id.kreativeusa.com',
      'https://id.kreativeusa.com',
      'http://kreativehyperlink.com',
      'https://kreativehyperlink.com',
      'http://api.kreativehyperlink.com',
      'https://api.kreativehyperlink.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'OPTIONS'],
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
