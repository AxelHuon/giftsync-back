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
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}
