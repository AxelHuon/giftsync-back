import jwt from "jsonwebtoken";
import { Body, Controller, Post, Response, Route, SuccessResponse } from "tsoa";
import AuthtokenModel from "../../models/authtoken.model";
import User from "../../models/user.model";

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
  @SuccessResponse<RegisterUserResponse>("200", "User successfully registered")
  @Response<Error>("400", "Email is already associated with an account")
  @Response<Error>("500", "Error in registering user")
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
  @SuccessResponse<SignInUserResponse>("200", "User successfully signed in")
  @Response<Error>("400", "Email and password are required")
  @Response<Error>("401", "Incorrect email and password combination")
  @Response<Error>("404", "User not found")
  @Response<Error>("500", "Error in signIn user")
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
  @SuccessResponse<RefreshTokenResponse>("200", "Tokens successfully refreshed")
  @Response<Error>("403", "Refresh Token is required!")
  @Response<Error>("404", "Invalid refresh token")
  @Response<Error>("500", "Internal server error")
  public async refreshToken(@Body() body: RefreshTokenRequest) {
    const { refreshToken: requestToken } = body;
    if (!requestToken) {
      this.setStatus(403);
      return {
        message: "Refresh Token is required!",
        code: "refresh_token_required",
      };
    }

    try {
      const refreshToken = await AuthtokenModel.findOne({
        where: { token: requestToken },
      });

      if (!refreshToken) {
        this.setStatus(404);
        return {
          message: "Invalid refresh token",
          code: "invalid_refresh_token",
        };
      }

      const isExpired =
        await AuthtokenModel.verifyAndDeleteExpiredToken(refreshToken);
      if (isExpired) {
        this.setStatus(403);
        return {
          message:
            "Refresh token was expired. Please make a new sign in request",
          code: "expired_refresh_token",
        };
      }

      const user = await User.findOne({
        where: { id: refreshToken.user },
        attributes: { exclude: ["password"] },
      });

      if (user) {
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
      } else {
        this.setStatus(404);
        return {
          message: "User not found",
          code: "user_not_found",
        };
      }
    } catch (err) {
      console.log("err", err);
      this.setStatus(500);
      return {
        message: "Internal server error",
        code: "internal_server_error",
      };
    }
  }
}
