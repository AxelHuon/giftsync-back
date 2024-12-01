import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

export class UserSecretSanta {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SecretSantaRequest {
  @IsNumber()
  @IsNotEmpty()
  maxPrice: number;
  @IsArray()
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => UserSecretSanta)
  users: UserSecretSanta[];
  @IsString()
  @IsNotEmpty()
  title: string;
}

export interface SecretSantaResponse {
  message: string;
  code: number;
}
