import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ApplicationDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  callbackUrl: string;
}

export class AidnDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(6)
  aidn: number;
}

export class VerifyAppchainDto {
  @IsNotEmpty()
  @IsString()
  appchain: string;
}
