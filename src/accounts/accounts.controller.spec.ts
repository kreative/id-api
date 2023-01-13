import { Test, TestingModule } from '@nestjs/testing';
import { KeychainsService } from '../keychains/keychains.service';
import { PostageService } from '../postage/postage.service';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

describe('Accounts Controller', () => {
  let controller: AccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        AccountsService,
        PostageService,
        PrismaService,
        KeychainsService,
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
