import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class KeychainDto {
  @IsNotEmpty()
  @IsNumber()
  ksn: number;

  @IsNotEmpty()
  @IsNumber()
  aidn: number;
}

export class VerifyKeychainDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(6)
  aidn: number;
  
  @IsNotEmpty()
  key: string;
}