import {
  Controller,
  Get,
  Middlewares,
  Path,
  Request,
  Res,
  Route,
  Tags,
  TsoaResponse,
} from "tsoa";
import { securityMiddleware } from "../../middleware/auth.middleware";
import User from "../../models/user.model";
import { ErrorResponse } from "../../types/Error";
import { UserClassGetResponse } from "./user.interface";

require("dotenv").config();

@Tags("User")
@Route("user")
@Middlewares([securityMiddleware])
export class UserController extends Controller {
  @Get("{userId}/rooms")
  public async getRoomOfaUser(
    @Request() req: any,
    @Path() userId: string,
    @Res() errorResponse: TsoaResponse<401 | 404 | 500, ErrorResponse>,
  ): Promise<any> {
    try {
      const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ["password"] },
      });
      const rooms = await user?.getRooms();
      return rooms;
    } catch (err) {
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  @Get("{userId}")
  public async getUserById(
    @Path() userId: string,
    @Request() req: any,
    @Res() errorResponse: TsoaResponse<401 | 404 | 500, ErrorResponse>,
  ): Promise<UserClassGetResponse> {
    try {
      const user = await User.findOne({
        where: { id: userId },
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
      console.error("Error in getUserById:", err);
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }
}
