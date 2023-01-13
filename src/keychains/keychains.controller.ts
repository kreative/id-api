import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { VerifyKeychainDto } from "./keychains.dto";
import { KeychainsService } from "./keychains.service";

@Controller('keychains')
export class KeychainsController {
  constructor(private keychainService: KeychainsService) {}
  
  @Get('')
  getAllKeychains() {
    return this.keychainService.getAllKeychains(); 
  }

  @Post(':id/close')
  closeKeychain(@Param('id', ParseIntPipe) id: number) {
    return this.keychainService.closeKeychain(id);
  }

  @Post('verify')
  verifyKeychain(@Body() dto: VerifyKeychainDto) {
    return this.keychainService.verifyKeychain(dto);
  }
}
