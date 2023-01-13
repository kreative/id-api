import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '../prisma/prisma.module';
import { ApplicationsService } from './applications.service';

describe('Applications Service', () => {
  let service: ApplicationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplicationsService],
      imports: [PrismaModule],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  // should pass and define the service
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // should pass create a new application
  // should pass and retrieves all applications
});
