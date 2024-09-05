import jwt from "jsonwebtoken";
import {
  Controller,
  Get,
  Middlewares,
  Request,
  Res,
  Route,
  Tags,
  TsoaResponse,
} from "tsoa";
import { getToken, securityMiddleware } from "../../middleware/auth.middleware";
import User from "../../models/user.model";
import { ErrorResponse } from "../../types/Error";
import { UserClassGetMeResponse } from "./userClass";

require("dotenv").config();

@Tags("User")
@Route("user")
export class UserController extends Controller {
  @Get("get-me")
  @Middlewares(securityMiddleware)
  public async getMe(
    @Request() req: any,
    @Res() errorResponse: TsoaResponse<401 | 404 | 500, ErrorResponse>,
  ): Promise<UserClassGetMeResponse> {
    try {
      const token = getToken(req.headers);
      console.log(token);
      if (!token) {
        return errorResponse(401, {
          message: "Unauthorized",
          code: "unauthorized",
        });
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
      if (typeof decodedToken !== "object" || !("id" in decodedToken)) {
        return errorResponse(404, {
          message: "Internal Server Error",
          code: "internal_server_error",
        });
      }
      const user = await User.findOne({
        where: { id: decodedToken.id },
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        return errorResponse(404, {
          message: "User not found",
          code: "user_not_found",
        });
      }
      this.setStatus(200);
      return user;
    } catch (err) {
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }
}
