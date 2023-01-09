import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { SigninDto, SignupDto, UpdateAccountDto } from './accounts.dto';

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

  @Patch('')
  updateAccount(@Body() dto: UpdateAccountDto) {
    return this.accountsService.updateAccount(dto);
  }

  @Post('logout')
  logout(@Body() dto: LogoutDto) {}
}
