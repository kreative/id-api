import { Controller, Get, HttpException } from '@nestjs/common';

import logger from "../utils/logger";

@Controller('')
export class AppController {
  @Get()
  async home(): Promise<string> {
    logger.info(`GET /v1 initiated within app controller`);
    return "Welcome to the good place, friend. It's good to see you.";
  };
  
  @Get('throw')
  throwError(): string {
    logger.info(`GET /v1/throw initiated (sentry test method)`);
    throw new HttpException({ message: 'Sample Error' }, 500);
  }
}
