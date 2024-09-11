import {
  Controller,
  Get,
  Path,
  Request,
  Res,
  Route,
  Tags,
  TsoaResponse,
} from "tsoa";
import User from "../../models/user.model";
import { ErrorResponse } from "../../types/Error";
import { UserClassGetResponse } from "./user.interface";

require("dotenv").config();

@Tags("User")
@Route("user")
export class UserController extends Controller {
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
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }
}
