import axios from "axios";
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
import transport from "../../config/mailConfig";
import prisma from "../../config/prisma";
import { validationBodyMiddleware } from "../../middleware/validation.middleware";
import { AuthTokenModel } from "../../models/authToken.model";
import { AuthTokenForgotPasswordModel } from "../../models/authTokenForgotPasswords.model";
import { UserModel } from "../../models/user.model";
import { ErrorResponse } from "../../types/Error";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SignInUserRequest,
  SignInUserResponse,
  SignInWithGoogleRequest,
} from "./auth.interface";

const bcrypt = require("bcrypt");
require("dotenv").config();

const frontUrl = process.env.FRONTEND_URL;

@Tags("Auth")
@Route("auth")
export class AuthController extends Controller {
  @Post("signup")
  @Middlewares([validationBodyMiddleware(RegisterUserRequest)])
  public async registerUser(
    @Body() body: RegisterUserRequest,
    @Res() errorResponse: TsoaResponse<400 | 422 | 500, ErrorResponse>,
  ): Promise<RegisterUserResponse> {
    try {
      const { firstName, lastName, email, password, dateOfBirth } = body;
      const userExists = await prisma.users.findUnique({ where: { email } });
      if (userExists) {
        return errorResponse(400, {
          message: "Email is already associated with an account",
          code: "email_already_exists",
        });
      }
      this.setStatus(200);
      const user = await UserModel.createUser(body);
      return {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth,
        profilePicture: user.profilePicture,
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      console.log(error);
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
      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (user) {
        const passwordValid = await bcrypt.compare(
          passwordRequest,
          user.password,
        );
        if (!passwordValid) {
          return errorResponse(400, {
            message: "Incorrect email and password combination",
            code: "error_signIn_combination",
          });
        }

        const tokenExists = await prisma.authTokens.findMany({
          where: { user: user.id },
        });

        if (tokenExists) {
          /*for tokenExist delete*/
          await prisma.authTokens.deleteMany({
            where: { user: user.id },
          });
        }

        const refreshToken = await AuthTokenModel.createToken(user.id);
        const token = jwt.sign({ id: user.id }, secretKey ?? "", {
          expiresIn: process.env.JWT_EXPIRATION || "24h",
        });
        this.setStatus(200);
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user?.profilePicture,
          accessToken: token,
          dateOfBirth: user.dateOfBirth,
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
  @Post("signin-google")
  @Middlewares([validationBodyMiddleware(SignInWithGoogleRequest)])
  public async signInUserWithGoogle(
    @Body() body: SignInWithGoogleRequest,
    @Res() errorResponse: TsoaResponse<400 | 401 | 500, ErrorResponse>,
  ): Promise<SignInUserResponse> {
    const { idToken } = body;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    try {
      // Crée un nouveau client OAuth2 avec ton Client ID
      let googlePayload: any;

      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );

      googlePayload = userInfoResponse.data;

      const { email, given_name, family_name, picture } = googlePayload;

      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (user) {
        this.setStatus(200);
        const refreshToken = await AuthTokenModel.createToken(user.id);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET ?? "", {
          expiresIn: process.env.JWT_EXPIRATION || "24h",
        });
        return {
          accessToken: token,
          refreshToken: refreshToken,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: user.dateOfBirth,
          profilePicture: user.profilePicture,
          id: user.id,
        };
      } else {
        const newUser = await UserModel.createUser({
          firstName: given_name,
          lastName: family_name,
          email: email,
          password: undefined,
          dateOfBirth: undefined,
          profilePicture: picture,
        });
        /*Create new acces token and refresh token*/
        const refreshToken = await AuthTokenModel.createToken(newUser.id);
        const token = jwt.sign(
          { id: newUser.id },
          process.env.JWT_SECRET ?? "",
          {
            expiresIn: process.env.JWT_EXPIRATION || "24h",
          },
        );
        this.setStatus(200);
        return {
          accessToken: token,
          refreshToken: refreshToken,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          dateOfBirth: newUser.dateOfBirth,
          profilePicture: newUser.profilePicture,
          id: newUser.id,
        };
      }
    } catch (error) {
      console.error(error);
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
      const refreshToken = await prisma.authTokens.findUnique({
        where: { token: requestToken },
      });

      if (!refreshToken) {
        return errorResponse(404, {
          message: "Invalid refresh token",
          code: "invalid_refresh_token",
        });
      }

      const isExpired =
        await AuthTokenModel.verifyAndDeleteExpiredToken(refreshToken);
      if (isExpired) {
        return errorResponse(403, {
          message:
            "Refresh token was expired. Please make a new sign in request",
          code: "expired_refresh_token",
        });
      }

      const user = await prisma.users.findUnique({
        where: { id: refreshToken.user },
        omit: { password: true },
      });

      if (!user) {
        return errorResponse(404, {
          message: "UserModel not found",
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

      const newRefreshToken = await AuthTokenModel.createToken(user.id);

      await prisma.authTokens.delete({ where: { id: refreshToken.id } });

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

  @Post("forgot-password")
  @Middlewares([validationBodyMiddleware(ForgotPasswordRequest)])
  public async forgotPassword(
    @Body() body: ForgotPasswordRequest,
    @Res() errorResponse: TsoaResponse<403 | 404 | 500, ErrorResponse>,
  ): Promise<ForgotPasswordResponse> {
    const { email } = body;
    if (!email) {
      return errorResponse(403, {
        message: "Email is required",
        code: "email_is_required",
      });
    }

    try {
      const user = await prisma.users.findUnique({
        where: { email: email },
      });

      if (!user) {
        return errorResponse(404, {
          message: "No user found",
          code: "no_user_found",
        });
      }
      const forgotPasswordToken =
        await AuthTokenForgotPasswordModel.createForgotPasswordToken(user.id);
      if (forgotPasswordToken) {
        const url = `${process.env.FRONTEND_URL}/auth/reset-password?token=${forgotPasswordToken}`;
        await this.sendEmailForgotPassword(email, url);
        this.setStatus(200);
        return {
          message: `${forgotPasswordToken}`,
          code: "email_sent",
        };
      }
    } catch (err) {
      return errorResponse(500, {
        message: "Internal server error",
        code: "internal_server_error",
      });
    }
  }

  @Put("reset-password")
  @Middlewares([validationBodyMiddleware(ResetPasswordRequest)])
  public async resetPassword(
    @Body() body: ResetPasswordRequest,
    @Res() errorResponse: TsoaResponse<403 | 500, ErrorResponse>,
  ): Promise<ResetPasswordResponse> {
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

      const tokenInformation = await prisma.authTokenForgotPasswords.findUnique(
        {
          where: { token: token },
        },
      );

      const isExpired =
        await AuthTokenForgotPasswordModel.verifyAndDeleteExpiredTokenForgotPassword(
          tokenInformation,
        );
      if (isExpired) {
        return errorResponse(403, {
          message: "Token was expired. Please make a new sign in request",
          code: "token_refresh_token",
        });
      }
      const user = await prisma.users.findUnique({
        where: { id: tokenInformation.user },
      });
      if (user) {
        user.password = await bcrypt.hash(newPassword, 12);
        await prisma.authTokenForgotPasswords.delete({
          where: { id: tokenInformation.id },
        });

        /*update user*/
        await prisma.users.update({
          where: { id: user.id },
          data: {
            password: user.password,
          },
        });
        this.setStatus(200);
        return {
          message: "Password changed successfully",
          code: "password_changed",
        };
      } else {
        return errorResponse(403, {
          message: "No UserModel found",
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

  private generateEmailContent(email: string, url: string): string {
    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gift Sync - Réinitialisation de votre mot de passe</title>
    </head>
    <body style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA; color: #1F1F1F;">
        <div style="text-align: center; padding-top: 20px; padding-bottom: 20px;">
            <img src="https://www.giftsync.fr/images/gslogo.png" alt="Logo" style="width: 200px; max-width: 100%; height: auto; margin-bottom: 20px;">
            <h1 style="color: #4747FF; margin: 0; font-size: 24px; font-weight: bold;">Réinitialisation de votre mot de passe</h1>
        </div>
        <div style="text-align: center; padding-top: 20px;">
            <p style="margin-bottom: 15px;">Bonjour,</p>
            <p style="margin-bottom: 15px;">Vous avez demandé à réinitialiser votre mot de passe pour le compte ${email}</p>
            <p style="margin-bottom: 30px;">Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe.</p>
            <a style="padding: 12px;text-decoration: none; background:#4747FF; color:#FAFAFA; border-radius: 12px;margin-bottom: 30px; font-weight: 500" href="${url}">Réinitialiser mon mot de passe</a>
            <p style="margin-top: 30px">Si ce n'est pas vous qui êtes a l'origine de cette modification de mot de passe veuillez contacter le support <a href="mailto:support@giftsync.fr">ici</a></p>
        </div>
    </body>
    </html>
  `;
  }

  private async sendEmailForgotPassword(
    email: string,
    url: string,
  ): Promise<void> {
    const contentMail = this.generateEmailContent(email, url);
    const mailOptions = {
      from: "noreply@giftsync.fr",
      to: email,
      subject: "Gift Sync - Réinitialisation de votre mot de passe",
      html: contentMail,
    };
    await transport.sendMail(mailOptions);
  }
}
