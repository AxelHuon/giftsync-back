export class RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDay: string;
}

export interface SignInUserRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  message: string;
  code: string;
}


export interface ForgotPasswordResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ForgotPasswordResetPasswordResponse {
  message: string;
  code: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignInUserResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegisterUserResponse {
  message: string;
  code: string;
}
