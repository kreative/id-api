import { Test, TestingModule } from '@nestjs/testing';
import { KeychainsModule } from '../keychains/keychains.module';
import { PostageModule } from '../postage/postage.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AccountsService } from './accounts.service';

describe('Accounts Service', () => {
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountsService],
      imports: [KeychainsModule, PostageModule, PrismaModule],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
