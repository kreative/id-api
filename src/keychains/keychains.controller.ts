import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { VerifyKeychainDto } from './keychains.dto';
import { KeychainsService } from './keychains.service';

import logger from '../../utils/logger';

@Controller('keychains')
export class KeychainsController {
  constructor(private keychainService: KeychainsService) {}

  @Get('')
  getAllKeychains() {
    logger.info(`GET /keychains initiated`);
    return this.keychainService.getAllKeychains();
  }

  @Post(':id/close')
  closeKeychain(@Param('id', ParseIntPipe) id: number) {
    logger.info(`POST /keychains/${id}/close initiated`);
    return this.keychainService.closeKeychain(id);
  }

  @Post('verify')
  verifyKeychain(@Body() dto: VerifyKeychainDto) {
    logger.info(`POST /keychains/verify initiated with body: ${dto}`);
    return this.keychainService.verifyKeychain(dto);
  }
}
