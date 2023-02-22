import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class PostageDto {
  fromAddress?: string;

  replyTo?: string;

  @IsNotEmpty()
  @IsString()
  toAddress: string;

  @IsNotEmpty()
  @IsString()
  template: string;

  @IsNotEmpty()
  @IsArray()
  data: string[];
}
