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
  app.enableCors();
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
bootstrap();
