import jwt from "jsonwebtoken";
import process from "node:process";
import {
  Body,
  Controller,
  Middlewares,
  Post,
  Put,
  Res,
  Route,
  Tags,
  TsoaResponse,
} from "tsoa";
import transport from "../../mailConfig/mailConfig";
import { validationBodyMiddleware } from "../../middleware/validation.middleware";
import AuthtokenModel from "../../models/authtoken.model";
import AuthTokenForgotPassword from "../../models/authtokenForgotPassword.model";
import User from "../../models/user.model";
import { ErrorResponse } from "../../types/Error";
import {
  ForgotPasswordResetPasswordRequest,
  ForgotPasswordResetPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterUserDTO,
  RegisterUserResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SignInUserRequest,
  SignInUserResponse,
} from "./authClass";

const bcrypt = require("bcrypt");

@Tags("Auth")
@Route("auth")
export class AuthController extends Controller {
  @Post("signup")
  @Middlewares([validationBodyMiddleware(RegisterUserDTO)])
  public async registerUser(
    @Body() body: RegisterUserDTO,
    @Res() errorResponse: TsoaResponse<400 | 422 | 500, ErrorResponse>,
  ): Promise<RegisterUserResponse> {
    try {
      const { firstName, lastName, email, password, birthDay } = body;
      const userExists = await User.findOne({ where: { email } });
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
        birthDay,
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
  @Middlewares([validationBodyMiddleware(SignInUserRequest)])
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
        const passwordValid = await bcrypt.compare(
          passwordRequest,
          user.dataValues.password,
        );
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
          birthDay: user.birthDay,
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
  @Middlewares([validationBodyMiddleware(RefreshTokenRequest)])
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
  @Middlewares([validationBodyMiddleware(ResetPasswordRequest)])
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
        console.log("No user found");
        return errorResponse(500, {
          message: "Internal server error",
          code: "internal_server_error",
        });
      }
      const forgotPasswordToken =
        await AuthTokenForgotPassword.createForgotPasswordToken(user);
      if (forgotPasswordToken) {
        const mailOptions = {
          from: "noreply@email.com",
          to: user.email,
          subject: "Forgot password",
          html: `<p>${forgotPasswordToken}</p>`,
        };
        try {
          await transport.sendMail(mailOptions);
          this.setStatus(200);
          return {
            message: "Email Sent",
            code: "email_sent",
          };
        } catch (error) {
          console.log(error);
          return errorResponse(500, {
            message: "Internal server error",
            code: "internal_server_error",
          });
        }
      }
    } catch (err) {
      console.log(err);
      return errorResponse(500, {
        message: "Internal server error",
        code: "internal_server_error",
      });
    }
  }

  @Put("forgot-password")
  @Middlewares([validationBodyMiddleware(ForgotPasswordResetPasswordRequest)])
  public async forgotPassword(
    @Body() body: ForgotPasswordResetPasswordRequest,
    @Res() errorResponse: TsoaResponse<403 | 500, ErrorResponse>,
  ): Promise<ForgotPasswordResetPasswordResponse> {
    try {
      const { token, newPassword } = body;
      if (!newPassword) {
        return errorResponse(403, {
          message: "Password is required!",
          code: "password_required",
        });
      }
      if (!token) {
        return errorResponse(403, {
          message: "No token provided",
          code: "no_token_provided",
        });
      }

      const tokenInformation = await AuthTokenForgotPassword.findOne({
        where: { token: token },
      });

      const isExpired =
        await AuthTokenForgotPassword.verifyAndDeleteExpiredTokenForgotPassword(
          tokenInformation,
        );
      if (isExpired) {
        return errorResponse(403, {
          message: "Token was expired. Please make a new sign in request",
          code: "token_refresh_token",
        });
      }
      const user = await User.findOne({ where: { id: tokenInformation.user } });
      if (user) {
        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();
        this.setStatus(200);
        return {
          message: "Password changed successfully",
          code: "password_changed",
        };
      } else {
        return errorResponse(403, {
          message: "No User found",
          code: "no_user_found",
        });
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
