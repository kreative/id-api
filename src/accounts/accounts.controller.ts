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
    logger.info(`POST /accounts/signup initiated with body: ${dto}`);
    return this.accountsService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: SigninDto) {
    logger.info(`POST /accounts/signin initiated with body: ${dto}`);
    return this.accountsService.signin(dto);
  }

  @Post('update')
  @HttpCode(HttpStatus.OK)
  updateAccount(@Body() dto: UpdateAccountDto) {
    logger.info(`POST /accounts/update initiated with body: ${dto}`);
    return this.accountsService.updateAccount(dto);
  }

  @Post('update/permissions')
  @HttpCode(HttpStatus.OK)
  updatePermissions(@Body() dto: UpdatePermissionsDto) {
    logger.info(
      `POST /accounts/update/permissions initiated with body: ${dto}`,
    );
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
    logger.info(`POST /accounts/resetCode/send initiated with body: ${dto}`);
    return this.accountsService.sendResetCode(dto);
  }

  @Post(':ksn/resetCode/verify')
  @HttpCode(HttpStatus.OK)
  async verifyResetCode(
    @Param('ksn', ParseIntPipe) ksn: number,
    @Body() dto: VerifyCodeDto,
  ) {
    logger.info(
      `POST /accounts/${ksn}/resetCode/verify initiated with body: ${dto}`,
    );
    return this.accountsService.verifyResetCode(ksn, dto);
  }

  @Post(':ksn/resetPassword')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('ksn', ParseIntPipe) ksn: number,
    @Body() dto: ResetPasswordDto,
  ) {
    logger.info(
      `POST /accounts/${ksn}/resetPassword initiated with body: ${dto}`,
    );
    return this.accountsService.resetPassword(ksn, dto);
  }
}
