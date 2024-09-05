import {
  IsDateString,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterUserRequest {
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsString({ message: "First name must be a string" })
  @Matches(/^[a-zA-Z]+$/, { message: "First name must contain only letters" })
  @MaxLength(50, { message: "First name must be at most 50 characters long" })
  firstName: string;

  @IsString({ message: "Last name must be a string" })
  @MaxLength(50, { message: "Last name must be at most 50 characters long" })
  @Matches(/^[a-zA-Z]+$/, { message: "Last name must contain only letters" })
  lastName: string;

  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(50, { message: "Password must be at most 50 characters long" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    },
  )
  password: string;

  @IsDateString({}, { message: "Invalid date format for birthDay" })
  birthDay: string;
}

export interface RegisterUserResponse {
  message: string;
  code: string;
}

export class SignInUserRequest {
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsString()
  password: string;
}

export interface SignInUserResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
  firstName: string;
  lastName: string;
  birthDay: string;
  email: string;
}

export class RefreshTokenRequest {
  @IsString()
  refreshToken: string;
}
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class ForgotPasswordRequest {
  @IsEmail({}, { message: "Invalid email format" })
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  code: string;
}

export class ResetPasswordRequest {
  @IsString()
  token: string;
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    },
  )
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  code: string;
}
