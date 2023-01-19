import { forwardRef, Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { KeychainsController } from './keychains.controller';
import { KeychainsService } from './keychains.service';

@Module({
  providers: [KeychainsService],
  controllers: [KeychainsController],
  exports: [KeychainsService],
})
export class KeychainsModule {}
