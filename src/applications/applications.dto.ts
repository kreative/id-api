import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class NewApplicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  callbackUrl: string;

  @IsNotEmpty()
  @IsUrl()
  homepage: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsUrl()
  logoUrl?: string;

  @IsUrl()
  iconUrl?: string;
}

export class UpdateApplicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  callbackUrl: string;

  @IsNotEmpty()
  @IsUrl()
  homepage: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  logoUrl: string;

  @IsNotEmpty()
  @IsUrl()
  iconUrl: string;

  @IsNotEmpty()
  @IsBoolean()
  refreshAppchain: boolean;
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
