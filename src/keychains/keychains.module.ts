import { Module } from '@nestjs/common';
import { AccountsService } from 'src/accounts/accounts.service';
import { KeychainsController } from './keychains.controller';
import { KeychainsService } from './keychains.service';

@Module({
  imports: [AccountsService],
  providers: [KeychainsService],
  controllers: [KeychainsController],
  exports: [KeychainsService],
})
export class KeychainsModule {}
