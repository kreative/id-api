import { Module } from '@nestjs/common';
import { PostageService } from './postage.service';

@Module({
  providers: [PostageService],
  exports: [PostageService]
})
export class PostageModule {}
