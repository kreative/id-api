import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { KeychainsService } from './keychains.service';

describe('Keychains Service', () => {
  let service: KeychainsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeychainsService, PrismaService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<KeychainsService>(KeychainsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
