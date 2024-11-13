import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export interface UserClassGetResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserClassEditRequest {
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsDateString({}, { message: "Invalid date format for birthDay" })
  @IsNotEmpty()
  dateOfBirth: Date;
}

export class UserClassEditPasswordRequest {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

export class UserClassEditPasswordResponse {
  message: string;
  code: string;
}
