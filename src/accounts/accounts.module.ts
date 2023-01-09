import { Module } from '@nestjs/common';
import { KeychainsModule } from 'src/keychains/keychains.module';
import { PostageService } from 'src/postage/postage.service';
import {AccountsController} from "./accounts.controller";
import {AccountsService} from "./accounts.service";

@Module({
    imports: [KeychainsModule, PostageService],
    controllers: [AccountsController],
    providers: [AccountsService]
})
export class AccountsModule {}
