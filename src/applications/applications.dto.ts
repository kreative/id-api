import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class ApplicationDto {
  @IsNotEmpty()
  name: string;
}

export class AidnDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(6)
  aidn: number;
}