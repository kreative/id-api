import { Body, Controller, Post } from "@nestjs/common";
import { CloseKeychainDto } from "./keychains.dto";
import { KeychainsService } from "./keychains.service";

@Controller('keychains')
export class KeychainsController {
  constructor(private keychainService: KeychainsService) {}
  
  @Post('close')
  closeKeychain(@Body() dto: CloseKeychainDto) {
    return this.keychainService.closeKeychain(dto);
  }
}
