import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
  @HttpCode(HttpStatus.OK)
  getAllKeychains() {
    logger.info(`GET /keychains initiated`);
    return this.keychainService.getAllKeychains();
  }

  @Post(':id/close')
  @HttpCode(HttpStatus.OK)
  closeKeychain(@Param('id', ParseIntPipe) id: number) {
    logger.info(`POST /keychains/${id}/close initiated`);
    return this.keychainService.closeKeychain(id);
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyKeychain(@Body() dto: VerifyKeychainDto) {
    logger.info(`POST /keychains/verify initiated with body: ${dto}`);
    return this.keychainService.verifyKeychain(dto);
  }
}
