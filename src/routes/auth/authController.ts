import jwt from "jsonwebtoken";
import { Body, Controller, Post, Res, Route, TsoaResponse } from "tsoa";
import AuthtokenModel from "../../models/authtoken.model";
import User from "../../models/user.model";
import { ErrorResponse } from "../../types/Error";
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SignInUserRequest,
  SignInUserResponse,
} from "./authTypes";

const bcrypt = require("bcrypt");

@Route("auth")
export class AuthController extends Controller {
  @Post("signup")
  public async registerUser(
    @Body() body: RegisterUserRequest,
    @Res() errorResponse: TsoaResponse<400 | 500, ErrorResponse>,
  ): Promise<RegisterUserResponse> {
    const { firstName, lastName, email, password } = body;
    try {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return errorResponse(400, {
          message: "Email is already associated with an account",
          code: "email_already_exists",
        });
      }

      await User.create({
        email,
        lastName,
        firstName,
        password: await bcrypt.hash(password, 12),
      });

      this.setStatus(200);
      return {
        message: "User successfully registered",
        code: "success_register",
      };
    } catch (error) {
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  @Post("signin")
  public async signInUser(
    @Body() body: SignInUserRequest,
    @Res() errorResponse: TsoaResponse<400 | 401 | 500, ErrorResponse>,
  ): Promise<SignInUserResponse> {
    const secretKey = process.env.JWT_SECRET;
    try {
      const { email, password: passwordRequest } = body;

      if (!email || !passwordRequest) {
        return errorResponse(400, {
          message: "Email and password are required",
          code: "email_and_password_required",
        });
      }
      const user = await User.findOne({
        where: { email },
      });

      if (user) {
        const passwordValid = bcrypt.compare(passwordRequest, user.password);
        if (!passwordValid) {
          return errorResponse(400, {
            message: "Incorrect email and password combination",
            code: "error_signIn_combination",
          });
        }
        const token = jwt.sign({ id: user.id }, secretKey ?? "", {
          expiresIn: "2h",
        });
        const refreshToken = await AuthtokenModel.createToken(user);

        this.setStatus(200);
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accessToken: token,
          refreshToken,
        };
      } else {
        return errorResponse(400, {
          message: "Incorrect email and password combination",
          code: "error_signIn_combination",
        });
      }
    } catch (error) {
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  @Post("refresh-token")
  public async refreshToken(
    @Body() body: RefreshTokenRequest,
    @Res() errorResponse: TsoaResponse<403 | 404 | 500, ErrorResponse>,
  ): Promise<RefreshTokenResponse> {
    const { refreshToken: requestToken } = body;

    if (!requestToken) {
      return errorResponse(403, {
        message: "Refresh Token is required!",
        code: "refresh_token_required",
      });
    }

    try {
      const refreshToken = await AuthtokenModel.findOne({
        where: { token: requestToken },
      });

      if (!refreshToken) {
        return errorResponse(404, {
          message: "Invalid refresh token",
          code: "invalid_refresh_token",
        });
      }

      const isExpired =
        await AuthtokenModel.verifyAndDeleteExpiredToken(refreshToken);
      if (isExpired) {
        return errorResponse(403, {
          message:
            "Refresh token was expired. Please make a new sign in request",
          code: "expired_refresh_token",
        });
      }

      const user = await User.findOne({
        where: { id: refreshToken.user },
        attributes: { exclude: ["password"] },
      });

      if (!user) {
        return errorResponse(404, {
          message: "User not found",
          code: "user_not_found",
        });
      }

      const newAccessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET ?? "",
        {
          expiresIn: process.env.JWT_EXPIRATION || "24h",
        },
      );

      const newRefreshToken = await AuthtokenModel.createToken(user);

      await AuthtokenModel.destroy({ where: { id: refreshToken.id } });

      this.setStatus(200);
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      console.log("err", err);
      return errorResponse(500, {
        message: "Internal server error",
        code: "internal_server_error",
      });
    }
  }

  @Post("request-forgot-password")
  public async requetsForgotPassword(
    @Body() body: ResetPasswordRequest,
    @Res() errorResponse: TsoaResponse<403 | 500, ErrorResponse>,
  ): Promise<ResetPasswordResponse> {
    const { email } = body;

    if (!email) {
      return errorResponse(403, {
        message: "Email is required",
        code: "email_is_required",
      });
    }

    try {
      const user = await User.findOne({
        where: { email: email },
      });

      if (!user) {
        return errorResponse(500, {
          message: "Internal server error",
          code: "internal_server_error",
        });
      }
      const forgotPasswordToken =
        await AuthtokenModel.createTokenForgotPassword(user);
      if (forgotPasswordToken) {
        this.setStatus(200);
        return {
          forgotPasswordToken,
        };
      }
    } catch (err) {
      console.log("err", err);
      return errorResponse(500, {
        message: "Internal server error",
        code: "internal_server_error",
      });
    }
  }
}
