import { Module } from '@nestjs/common';
import { KeychainsService } from './keychains.service';

@Module({
  providers: [KeychainsService]
})
export class KeychainsModule {}
