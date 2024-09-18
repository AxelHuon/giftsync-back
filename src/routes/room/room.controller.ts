import {
  Body,
  Controller,
  Delete,
  Get,
  Middlewares,
  Path,
  Post,
  Put,
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
import Room, { RoomAttributes } from "../../models/room.model";
import TokenInviteRoomModel from "../../models/tokenInviteRoom.model";
import User from "../../models/user.model";
import { ErrorResponse } from "../../types/Error";
import {
  CreateRoomRequest,
  InviteUserRequest,
  InviteUserResponse,
  JoinRoomRequest,
  JoinRoomResponse,
} from "./room.interface";

require("dotenv").config();

@Tags("Room")
@Route("room")
export class RoomController extends Controller {
  @Post("create")
  @Middlewares(securityMiddleware)
  @Middlewares([validationBodyMiddleware(CreateRoomRequest)])
  public async createRoom(
    @Request() req: any,
    @Body() body: CreateRoomRequest,
    @Res() errorResponse: TsoaResponse<401 | 404 | 422 | 500, ErrorResponse>,
  ): Promise<RoomAttributes> {
    try {
      const token = getToken(req.headers);
      const verifiedToken = await jwtVerify(token);
      if ("code" in verifiedToken) {
        return errorResponse(401, {
          message: verifiedToken.message,
          code: verifiedToken.code,
        });
      }
      const owner = await User.findOne({ where: { id: verifiedToken.id } });
      if (!owner) {
        return errorResponse(404, {
          message: "User not found",
          code: "user_not_found",
        });
      }
      const { title } = body;
      if (!title) {
        return errorResponse(422, {
          message: "Title is required",
          code: "title_required",
        });
      }
      const newRoom = await Room.create({
        title,
        ownerId: verifiedToken.id,
      });

      await newRoom.addUsers([owner]);

      this.setStatus(200);
      return newRoom;
    } catch (error) {
      console.log(error);

      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  @Post("invite-user")
  @Middlewares(securityMiddleware)
  @Middlewares([validationBodyMiddleware(InviteUserRequest)])
  public async inviteUser(
    @Request() req: any,
    @Body() body: InviteUserRequest,
    @Res() errorResponse: TsoaResponse<401 | 404 | 422 | 500, ErrorResponse>,
  ): Promise<InviteUserResponse> {
    try {
      const token = getToken(req.headers);
      const verifiedToken = await jwtVerify(token);
      if ("code" in verifiedToken) {
        return errorResponse(401, {
          message: verifiedToken.message,
          code: verifiedToken.code,
        });
      }
      const user = await User.findOne({ where: { id: verifiedToken.id } });
      if (!user) {
        return errorResponse(404, {
          message: "User not found",
          code: "user_not_found",
        });
      }
      const { email, roomId } = body;
      if (!email) {
        return errorResponse(422, {
          message: "Email is required",
          code: "email_required",
        });
      }
      if (!roomId) {
        return errorResponse(422, {
          message: "RoomId is required",
          code: "room_id_required",
        });
      }
      const room = await Room.findOne({ where: { id: roomId } });

      if (!room) {
        return errorResponse(404, {
          message: "Room not found",
          code: "room_not_found",
        });
      }

      room.getUsers().then((users) => {
        if (!users.find((u) => u.id === user.id)) {
          return errorResponse(401, {
            message: "Unauthorized",
            code: "unauthorized",
          });
        }
      });

      const roomInviteToken = await TokenInviteRoomModel.createToken(room);

      const url = `${process.env.FRONTEND_URL}/room/join/${roomInviteToken}`;

      this.setStatus(200);
      return {
        roomInviteToken: url,
      };
    } catch (error) {
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  @Post("join/:token")
  @Middlewares(securityMiddleware)
  @Middlewares([validationBodyMiddleware(JoinRoomRequest)])
  public async joinRoom(
    @Path() token: string,
    @Body() body: JoinRoomRequest,
    @Res() errorResponse: TsoaResponse<400 | 404 | 422 | 500, ErrorResponse>,
  ): Promise<JoinRoomResponse> {
    try {
      const { email } = body;
      if (!email) {
        return errorResponse(422, {
          message: "Email is required",
          code: "email_required",
        });
      }

      if (!token) {
        return errorResponse(422, {
          message: "Token is required",
          code: "token_required",
        });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return errorResponse(404, {
          message: "User not found",
          code: "user_not_found",
        });
      }

      const tokenInvite = await TokenInviteRoomModel.findOne({
        where: { token },
      });
      if (!tokenInvite) {
        return errorResponse(400, {
          message: "Invalid or expired token",
          code: "invalid_token",
        });
      }

      const isExpired =
        await TokenInviteRoomModel.verifyAndDeleteExpiredToken(tokenInvite);
      if (!isExpired) {
        const room = await Room.findOne({ where: { id: tokenInvite.room } });
        if (!room) {
          return errorResponse(404, {
            message: "Room not found",
            code: "room_not_found",
          });
        }

        const users = await room.getUsers();
        if (users.find((u) => u.id === user.id)) {
          return errorResponse(400, {
            message: "User already in room",
            code: "user_already_in_room",
          });
        }

        await room.addUsers([user]);

        this.setStatus(200);
        return {
          message: "Successfully joined the room",
          roomId: room.id,
        };
      } else {
        return errorResponse(400, {
          message: "Invalid or expired token",
          code: "invalid_token",
        });
      }
    } catch (error) {
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  @Delete("delete/:roomId")
  @Middlewares(securityMiddleware)
  public async deleteRoom(
    @Request() req: any,
    @Path() roomId: string,
    @Res() errorResponse: TsoaResponse<401 | 404 | 500, ErrorResponse>,
  ): Promise<RoomAttributes> {
    try {
      const token = getToken(req.headers);
      const verifiedToken = await jwtVerify(token);
      if ("code" in verifiedToken) {
        return errorResponse(401, {
          message: verifiedToken.message,
          code: verifiedToken.code,
        });
      }
      const user = await User.findOne({ where: { id: verifiedToken.id } });
      if (!user) {
        return errorResponse(404, {
          message: "User not found",
          code: "user_not_found",
        });
      }
      const room = await Room.findOne({ where: { id: roomId } });
      if (!room) {
        return errorResponse(404, {
          message: "Room not found",
          code: "room_not_found",
        });
      }
      if (room.ownerId !== user.id) {
        return errorResponse(401, {
          message: "Unauthorized",
          code: "unauthorized",
        });
      }
      await room.destroy();
      this.setStatus(200);
      return room;
    } catch (error) {
      console.log("error", error);
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  /*Put title of a Room*/
  @Put("update/:roomId")
  @Middlewares(securityMiddleware)
  @Middlewares([validationBodyMiddleware(CreateRoomRequest)])
  public async updateRoom(
    @Request() req: any,
    @Path() roomId: string,
    @Body() body: CreateRoomRequest,
    @Res() errorResponse: TsoaResponse<401 | 404 | 422 | 500, ErrorResponse>,
  ): Promise<RoomAttributes> {
    try {
      const token = getToken(req.headers);
      const verifiedToken = await jwtVerify(token);
      if ("code" in verifiedToken) {
        return errorResponse(401, {
          message: verifiedToken.message,
          code: verifiedToken.code,
        });
      }
      const user = await User.findOne({ where: { id: verifiedToken.id } });
      if (!user) {
        return errorResponse(404, {
          message: "User not found",
          code: "user_not_found",
        });
      }
      const room = await Room.findOne({ where: { id: roomId } });
      if (!room) {
        return errorResponse(404, {
          message: "Room not found",
          code: "room_not_found",
        });
      }
      if (room.ownerId !== user.id) {
        return errorResponse(401, {
          message: "Unauthorized",
          code: "unauthorized",
        });
      }
      const { title } = body;
      if (!title) {
        return errorResponse(422, {
          message: "Title is required",
          code: "title_required",
        });
      }
      room.title = title;
      await room.save();
      this.setStatus(200);
      return room;
    } catch (error) {
      console.log("error", error);
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }
  /*Get room by id*/
  @Get("{roomId}")
  @Middlewares(securityMiddleware)
  public async getRoomById(
    @Path() roomId: string,
    @Request() req: any,
    @Res() errorResponse: TsoaResponse<401 | 404 | 500, ErrorResponse>,
  ): Promise<RoomAttributes> {
    try {
      const token = getToken(req.headers);
      const verifiedToken = await jwtVerify(token);
      if ("code" in verifiedToken) {
        return errorResponse(401, {
          message: verifiedToken.message,
          code: verifiedToken.code,
        });
      }
      const user = await User.findOne({ where: { id: verifiedToken.id } });
      if (!user) {
        return errorResponse(404, {
          message: "User not found",
          code: "user_not_found",
        });
      }
      const room = await Room.findOne({ where: { id: roomId } });
      if (!room) {
        return errorResponse(404, {
          message: "Room not found",
          code: "room_not_found",
        });
      }

      const usersOfTheRoom = await room.getUsers();
      if (!usersOfTheRoom.find((u) => u.id === user.id)) {
        return errorResponse(401, {
          message: "Unauthorized",
          code: "unauthorized",
        });
      }
      this.setStatus(200);
      return room;
    } catch (error) {
      console.log("error", error);
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }
}
