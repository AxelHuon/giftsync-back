import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateRoomRequest {
  @IsString()
  @MinLength(5)
  title: string;
}

export class InviteUserRequest {
  @IsEmail()
  email: string;
  @IsString()
  roomId: string;
}

export interface InviteUserResponse {
  roomInviteToken: string;
}

export class JoinRoomRequest {
  @IsEmail()
  email: string;
}

export interface JoinRoomResponse {
  message: string;
  roomId: string;
}

export interface UserCollectionGetUserOfRoom {
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export interface GetRoomOfUserResponse {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
  users: UserCollectionGetUserOfRoom[];
}
