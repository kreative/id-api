import { IsNotEmpty } from "class-validator";

export class KeychainDto {
  @IsNotEmpty()
  ksn: bigint;

  @IsNotEmpty()
  aidn: bigint;
}