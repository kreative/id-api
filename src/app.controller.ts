import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  async home(): Promise<string> {
    return "Welcome to the good place, friend. It's good to see you.";
  }
}
