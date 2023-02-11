import { Module } from '@nestjs/common';
import { KeychainsController } from './keychains.controller';
import { KeychainsService } from './keychains.service';

@Module({
  providers: [KeychainsService],
  controllers: [KeychainsController],
  exports: [KeychainsService],
})
export class KeychainsModule {}
