import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';

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
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  appchain: string;
}

export class CloseKeychainDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(6)
  aidn: number;

  @IsNotEmpty()
  @IsString()
  appchain: string;
}
