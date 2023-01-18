import { Controller, Get, HttpException } from '@nestjs/common';

import logger from "../utils/logger";

@Controller('')
export class AppController {
  @Get()
  async home(): Promise<string> {
    logger.info("200: ID Application Home Method");
    return "Welcome to the good place, friend. It's good to see you.";
  };
  
  @Get('throw')
  throwError(): string {
    throw new HttpException({ message: 'Sample Error' }, 500);
  }
}
