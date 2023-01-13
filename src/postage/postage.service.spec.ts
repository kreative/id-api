import { Test, TestingModule } from '@nestjs/testing';
import { PostageService } from './postage.service';

describe('Postage Service', () => {
  let service: PostageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostageService],
    }).compile();

    service = module.get<PostageService>(PostageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
