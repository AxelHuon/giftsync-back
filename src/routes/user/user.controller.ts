import {
  Body,
  Controller,
  Get,
  Middlewares,
  Patch,
  Path,
  Request,
  Res,
  Route,
  Tags,
  TsoaResponse,
} from "tsoa";
import {
  getToken,
  jwtVerify,
  securityMiddleware,
} from "../../middleware/auth.middleware";
import { validationBodyMiddleware } from "../../middleware/validation.middleware";
import User from "../../models/user.model";
import { ErrorResponse } from "../../types/Error";
import { UserClassEditRequest, UserClassGetResponse } from "./user.interface";

require("dotenv").config();

@Tags("User")
@Route("user")
export class UserController extends Controller {
  @Get("{userId}/rooms")
  @Middlewares([securityMiddleware])
  public async getRoomOfAUser(
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
  @Middlewares([securityMiddleware])
  public async getUserById(
    @Path() userId: string,
    @Request() req: any,
    @Res()
    errorResponse: TsoaResponse<401 | 404 | 500, ErrorResponse>,
  ): Promise<UserClassGetResponse> {
    try {
      const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ["password"] },
        include: ["rooms"],
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

  /*Root to edit firstName lastName and dateOfBirth*/
  @Patch("{userId}")
  @Middlewares([
    securityMiddleware,
    validationBodyMiddleware(UserClassEditRequest),
  ])
  public async postUserInformations(
    @Path() userId: string,
    @Request() req: any,
    @Body() body: UserClassEditRequest,
    @Res() errorResponse: TsoaResponse<401 | 404 | 500, ErrorResponse>,
  ): Promise<UserClassGetResponse> {
    try {
      const token = getToken(req.headers);
      const decodedToken = await jwtVerify(token);
      if ("code" in decodedToken) {
        return errorResponse(401, decodedToken);
      }
      if (decodedToken.id !== userId) {
        return errorResponse(401, {
          message: "Unauthorized",
          code: "unauthorized",
        });
      }
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
      /*get body data*/
      const { firstName, lastName, dateOfBirth } = body;
      /*update user data*/
      await user.update({ firstName, lastName, dateOfBirth });
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
