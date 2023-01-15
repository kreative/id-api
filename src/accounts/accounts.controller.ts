import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {
  SigninDto,
  SignupDto,
  UpdateAccountDto,
  VerifyCodeDto,
  ResetPasswordDto,
  SendCodeDto,
} from './accounts.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private accountsService: AccountsService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.accountsService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: SigninDto) {
    return this.accountsService.signin(dto);
  }

  @Post('update')
  updateAccount(@Body() dto: UpdateAccountDto) {
    return this.accountsService.updateAccount(dto);
  }

  @Get(':ksn')
  getAccount(@Param('ksn', ParseIntPipe) ksn: number) {
    return this.accountsService.getAccount(ksn);
  }

  @Post('resetCode/send')
  async sendResetCode(@Body() dto: SendCodeDto) {
    return this.accountsService.sendResetCode(dto);
  }

  @Post(':ksn/resetCode/verify')
  async verifyResetCode(@Param('ksn', ParseIntPipe) ksn: number, @Body() dto: VerifyCodeDto) {
    return this.accountsService.verifyResetCode(ksn, dto);
  }

  @Post(':ksn/resetPassword')
  async resetPassword(@Param('ksn', ParseIntPipe) ksn: number, @Body() dto: ResetPasswordDto) {
    return this.accountsService.resetPassword(ksn, dto);
  }
}
