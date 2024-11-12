import { IsDate, IsString } from "class-validator";

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
  firstName: string;
  @IsString()
  lastName: string;
  @IsDate()
  dateOfBirth: Date;
}
