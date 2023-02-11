import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class ApplicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  callbackUrl: string;

  @IsBoolean()
  refreshAppchain?: boolean;
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
