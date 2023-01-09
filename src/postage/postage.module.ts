import { Module } from '@nestjs/common';
import { PostageService } from './postage.service';

@Module({
  providers: [PostageService]
})
export class PostageModule {}
