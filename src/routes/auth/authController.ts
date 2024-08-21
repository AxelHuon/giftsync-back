import jwt from "jsonwebtoken";
import { Body, Controller, Post, Res, Route, TsoaResponse } from "tsoa";
import AuthtokenModel from "../../models/authtoken.model";
import User from "../../models/user.model";
import { ErrorResponse } from "../../types/Error";

const bcrypt = require("bcrypt");

interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterUserResponse {
  message: string;
  code: string;
}

interface SignInUserRequest {
  email: string;
  password: string;
}

interface SignInUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Route("auth")
export class AuthController extends Controller {
  @Post("signup")
  public async registerUser(@Body() body: RegisterUserRequest) {
    const { firstName, lastName, email, password } = body;
    const userExists = await User.findOne({
      where: { email },
    });
    if (userExists) {
      this.setStatus(400); // you can set the response status code manually
      return {
        message: "Email is already associated with an account",
        code: "email_already_exists",
      };
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
  }

  @Post("signin")
  public async signInUser(@Body() body: SignInUserRequest) {
    const secretKey = process.env.JWT_SECRET;
    const { email, password: passwordRequest } = body;

    if (!email || !passwordRequest) {
      this.setStatus(400);
      return {
        message: "Email and password are required",
        code: "email_and_password_required",
      };
    }

    const user = await User.findOne({
      where: { email },
    });

    if (user) {
      const passwordValid = await bcrypt.compare(
        passwordRequest,
        user.password,
      );
      if (!passwordValid) {
        this.setStatus(401);
        return {
          message: "Incorrect email and password combination",
          code: "error_signIn_combination",
        };
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
      this.setStatus(404);
      return {
        message: "User not found",
        code: "user_not_found",
      };
    }
  }

  @Post("refresh-token")
  public async refreshToken(
    @Body() body: RefreshTokenRequest,
    @Res() errorResponse: TsoaResponse<403 | 404 | 500, ErrorResponse>,
  ): Promise<RefreshTokenResponse | void> {
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
}
