import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { KeychainsModule } from './keychains/keychains.module';
import { ApplicationsModule } from './applications/applications.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostageModule } from './postage/postage.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountsModule,
    TransactionsModule,
    KeychainsModule,
    ApplicationsModule,
    PrismaModule,
    PostageModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
