import { IsNotEmpty } from "class-validator";

export class KeychainDto {
  @IsNotEmpty()
  ksn: bigint;

  @IsNotEmpty()
  aidn: bigint;
}

export class CloseKeychainDto {
  @IsNotEmpty()
  keychainID: number;
}