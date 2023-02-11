import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class NewApplicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  callbackUrl: string;
}

export class UpdateApplicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  callbackUrl: string;

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
