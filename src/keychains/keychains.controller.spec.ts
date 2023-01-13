import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { KeychainsController } from './keychains.controller';
import { KeychainsService } from './keychains.service';

describe('Keychains Controller', () => {
  let controller: KeychainsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeychainsController],
      providers: [KeychainsService, PrismaService],
    }).compile();

    controller = module.get<KeychainsController>(KeychainsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
