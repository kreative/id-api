import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {
  SigninDto,
  SignupDto,
  UpdateAccountDto,
  VerifyCodeDto,
  ResetPasswordDto,
  SendCodeDto,
  UpdatePermissionsDto,
} from './accounts.dto';
import logger from '../../utils/logger';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  signup(@Body() dto: SignupDto) {
    logger.info({ message: `POST /accounts/signup initiated`, body: dto });
    return this.accountsService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: SigninDto) {
    logger.info({ message: `POST /accounts/signin initiated`, body: dto });
    return this.accountsService.signin(dto);
  }

  @Post('update')
  @HttpCode(HttpStatus.OK)
  updateAccount(@Body() dto: UpdateAccountDto) {
    logger.info({ message: `POST /accounts/update initiated`, body: dto });
    return this.accountsService.updateAccount(dto);
  }

  @Post('update/permissions')
  @HttpCode(HttpStatus.OK)
  updatePermissions(@Body() dto: UpdatePermissionsDto) {
    logger.info({
      message: `POST /accounts/update/permissions initiated`,
      body: dto,
    });
    return this.accountsService.updatePermissions(dto);
  }

  @Get(':ksn')
  @HttpCode(HttpStatus.OK)
  getAccount(@Param('ksn', ParseIntPipe) ksn: number) {
    logger.info(`GET /accounts/${ksn} initiated`);
    return this.accountsService.getAccount(ksn);
  }

  @Post('resetCode/send')
  @HttpCode(HttpStatus.OK)
  async sendResetCode(@Body() dto: SendCodeDto) {
    logger.info({
      message: `POST /accounts/resetCode/send initiated`,
      body: dto,
    });
    return this.accountsService.sendResetCode(dto);
  }

  @Post(':ksn/resetCode/verify')
  @HttpCode(HttpStatus.OK)
  async verifyResetCode(
    @Param('ksn', ParseIntPipe) ksn: number,
    @Body() dto: VerifyCodeDto,
  ) {
    logger.info({
      message: `POST /accounts/${ksn}/resetCode/verify initiated`,
      body: dto,
    });
    return this.accountsService.verifyResetCode(ksn, dto);
  }

  @Post(':ksn/resetPassword')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('ksn', ParseIntPipe) ksn: number,
    @Body() dto: ResetPasswordDto,
  ) {
    logger.info({
      message: `POST /accounts/${ksn}/resetPassword initiated`,
      body: dto,
    });
    return this.accountsService.resetPassword(ksn, dto);
  }
}
