import { Type } from "class-transformer";
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

export class UserSecretSanta {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
}

export class SecretSantaRequest {
  @IsNumber()
  maxPrice: number;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserSecretSanta)
  users: UserSecretSanta[];
}

export interface SecretSantaResponse {
  message: string;
  code: number;
}
