import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class CreateRoomRequest {
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  emails?: string[];
}

export class EditRoomRequest {
  @IsString()
  @MinLength(3)
  title: string;
}

export class InviteUserRequest {
  @IsArray()
  @IsEmail({}, { each: true })
  emails: string[];
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
  code: string;
  roomSlug: string;
}

export interface UserCollectionGetUserOfRoom {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export interface GetRoomElement {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
  users: UserCollectionGetUserOfRoom[];
  isOwner: boolean;
}

export interface GetRoomOfUserResponse {
  rooms: GetRoomElement[];
  total: number;
}
