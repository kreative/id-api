import { IsNotEmpty } from 'class-validator';

export class PostageDto {
  fromAddress?: string;

  replyTo?: string;

  @IsNotEmpty()
  body?: string;

  @IsNotEmpty()
  html?: string;

  @IsNotEmpty()
  toAddress: string;

  @IsNotEmpty()
  subjectLine: string;
}
