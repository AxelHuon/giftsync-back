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
import transport from "../../config/mailConfig";
import prisma from "../../config/prisma";
import {
  getToken,
  jwtVerify,
  securityMiddleware,
} from "../../middleware/auth.middleware";
import { validationBodyMiddleware } from "../../middleware/validation.middleware";
import { RoomAttributes, RoomModel } from "../../models/room.model";
import { TokenInviteRoomModel } from "../../models/tokenInviteRoom.model";
import { ErrorResponse } from "../../types/Error";
import {
  CreateRoomRequest,
  EditRoomRequest,
  GetRoomElement,
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
      const owner = await prisma.users.findUnique({
        where: { id: verifiedToken.id },
      });
      if (!owner) {
        return errorResponse(404, {
          message: "UserModel not found",
          code: "user_not_found",
        });
      }
      const { title, emails } = body;
      if (!title) {
        return errorResponse(422, {
          message: "Title is required",
          code: "title_required",
        });
      }
      const newRoom = await RoomModel.createRoom(title, verifiedToken.id);

      if (emails && emails.length > 0) {
        const invitedUsers: InviteUserResponse[] = [];
        const nameWhoInvite = owner.firstName + " " + owner.lastName;

        for (const email of emails) {
          const roomInviteToken =
            await TokenInviteRoomModel.createTokenInviteRoom(newRoom.id, email);

          const url = `${process.env.FRONTEND_URL}/families/join/${roomInviteToken}`;

          await this.sendMailInvitation(
            nameWhoInvite,
            email,
            url,
            newRoom.title,
          );

          invitedUsers.push({ roomInviteToken: url });
        }
      }

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

  @Post("invite-users")
  @Middlewares(securityMiddleware)
  @Middlewares([validationBodyMiddleware(InviteUserRequest)])
  public async inviteUsersToARoom(
    @Request() req: any,
    @Body() body: InviteUserRequest,
    @Res() errorResponse: TsoaResponse<401 | 404 | 422 | 500, ErrorResponse>,
  ): Promise<{ invitedUsers: InviteUserResponse[] }> {
    try {
      const token = getToken(req.headers);
      const verifiedToken = await jwtVerify(token);
      if ("code" in verifiedToken) {
        return errorResponse(401, {
          message: verifiedToken.message,
          code: verifiedToken.code,
        });
      }

      const userWhoInvite = await prisma.users.findUnique({
        where: { id: verifiedToken.id },
      });
      if (!userWhoInvite) {
        return errorResponse(404, {
          message: "User not found",
          code: "user_not_found",
        });
      }

      const { emails, roomId } = body;

      if (!emails || emails.length === 0) {
        return errorResponse(422, {
          message: "Emails are required",
          code: "emails_required",
        });
      }

      if (!roomId) {
        return errorResponse(422, {
          message: "RoomId is required",
          code: "room_id_required",
        });
      }

      const room = await prisma.rooms.findUnique({
        where: { id: roomId },
        include: { RoomUsers: true },
      });

      if (!room) {
        return errorResponse(404, {
          message: "Room not found",
          code: "room_not_found",
        });
      }

      if (!room.RoomUsers.find((u) => u.userId === userWhoInvite.id)) {
        return errorResponse(401, {
          message: "Unauthorized",
          code: "unauthorized",
        });
      }

      const invitedUsers: InviteUserResponse[] = [];
      const nameWhoInvite =
        userWhoInvite.firstName + " " + userWhoInvite.lastName;

      for (const email of emails) {
        const roomInviteToken =
          await TokenInviteRoomModel.createTokenInviteRoom(room.id, email);

        const url = `${process.env.FRONTEND_URL}/families/join/${roomInviteToken}`;

        await this.sendMailInvitation(nameWhoInvite, email, url, room.title);

        invitedUsers.push({ roomInviteToken: url });
      }
      this.setStatus(200);
      return { invitedUsers };
    } catch (error) {
      console.log(error);
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

      const user = await prisma.users.findUnique({ where: { email } });
      if (!user) {
        return errorResponse(404, {
          message: "UserModel not found",
          code: "user_not_found",
        });
      }

      const tokenInvite = await prisma.inviteTokenRooms.findUnique({
        where: { token },
      });
      if (!tokenInvite) {
        return errorResponse(400, {
          message: "Invalid or expired token",
          code: "invalid_token",
        });
      }

      const isExpired =
        await TokenInviteRoomModel.verifyAndDeleteTokenInviteRoom(tokenInvite);
      if (!isExpired) {
        const room = await prisma.rooms.findUnique({
          where: { id: tokenInvite.room },
          include: { RoomUsers: true },
        });
        if (!room) {
          return errorResponse(404, {
            message: "Room not found",
            code: "room_not_found",
          });
        }

        if (room.RoomUsers.find((u) => u.userId === user.id)) {
          return errorResponse(400, {
            message: "UserModel already in room",
            code: "user_already_in_room",
          });
        }

        /*Add User To the room*/
        await prisma.roomUsers.create({
          data: {
            roomId: room.id,
            userId: user.id,
          },
        });
        await prisma.inviteTokenRooms.delete({ where: { token } });

        this.setStatus(200);
        return {
          message: "Successfully joined the room",
          code: "success",
          roomSlug: room.slug,
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

  @Delete(":roomId/delete")
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
      const user = await prisma.users.findUnique({
        where: { id: verifiedToken.id },
      });
      if (!user) {
        return errorResponse(404, {
          message: "UserModel not found",
          code: "user_not_found",
        });
      }
      const room = await prisma.rooms.findUnique({ where: { id: roomId } });
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
      await prisma.rooms.delete({ where: { id: roomId } });
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
  @Put(":roomId/update")
  @Middlewares(securityMiddleware)
  @Middlewares([validationBodyMiddleware(CreateRoomRequest)])
  public async putRoom(
    @Request() req: any,
    @Path() roomId: string,
    @Body() body: EditRoomRequest,
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
      const user = await prisma.users.findUnique({
        where: { id: verifiedToken.id },
      });
      if (!user) {
        return errorResponse(404, {
          message: "UserModel not found",
          code: "user_not_found",
        });
      }
      const room = await prisma.rooms.findUnique({ where: { id: roomId } });
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
      const updatedRoom = await RoomModel.putRoom(title, roomId);
      this.setStatus(200);
      return updatedRoom;
    } catch (error) {
      console.log("error", error);
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  @Delete(":roomId/user/:userId")
  @Middlewares(securityMiddleware)
  public async deleteUserFromARoom(
    @Request() req: any,
    @Path() roomId: string,
    @Path() userId: string,
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
      const user = await prisma.users.findUnique({
        where: { id: verifiedToken.id },
      });
      if (!user) {
        return errorResponse(404, {
          message: "UserModel not found",
          code: "user_not_found",
        });
      }
      const room = await prisma.rooms.findUnique({ where: { id: roomId } });
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

      await prisma.roomUsers.delete({
        where: {
          roomId_userId: {
            roomId,
            userId,
          },
        },
      });

      this.setStatus(200);
    } catch (error) {
      console.log("error", error);
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  /*Get room by id*/
  @Get("{roomSlug}")
  @Middlewares(securityMiddleware)
  public async getRoomBySlug(
    @Path() roomSlug: string,
    @Request() req: any,
    @Res() errorResponse: TsoaResponse<401 | 404 | 500, ErrorResponse>,
  ): Promise<GetRoomElement> {
    try {
      const token = getToken(req.headers);
      const verifiedToken = await jwtVerify(token);
      if ("code" in verifiedToken) {
        return errorResponse(401, {
          message: verifiedToken.message,
          code: verifiedToken.code,
        });
      }
      const user = await prisma.users.findUnique({
        where: { id: verifiedToken.id },
      });
      if (!user) {
        return errorResponse(404, {
          message: "UserModel not found",
          code: "user_not_found",
        });
      }
      const room = await prisma.rooms.findUnique({
        where: { slug: roomSlug },
        include: {
          RoomUsers: {
            include: {
              Users: {
                select: {
                  firstName: true,
                  lastName: true,
                  id: true,
                  profilePicture: true,
                },
              },
            },
          },
        },
      });
      if (!room) {
        return errorResponse(404, {
          message: "Room not found",
          code: "room_not_found",
        });
      }

      if (!room.RoomUsers.find((u) => u.userId === user.id)) {
        return errorResponse(401, {
          message: "Unauthorized",
          code: "unauthorized",
        });
      }
      const isOwner = room.ownerId === user.id;
      const transformedRooms = {
        ...room,
        users: room.RoomUsers.map((roomUser) => roomUser.Users),
        isOwner,
      };

      this.setStatus(200);
      delete transformedRooms.RoomUsers;
      return transformedRooms;
    } catch (error) {
      console.log("error", error);
      return errorResponse(500, {
        message: "Internal Server Error",
        code: "internal_server_error",
      });
    }
  }

  private generateEmailContent(
    nameWhoInvite: string,
    url: string,
    nameRoom: string,
  ): string {
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
            <h1 style="color: #4747FF; margin: 0; font-size: 24px; font-weight: bold;">${nameWhoInvite} vous invite à rejoindre la famille ${nameRoom}</h1>
        </div>
        <div style="text-align: center; padding-top: 20px;">
            <p style="margin-bottom: 15px;">Bonjour,</p>
            <p style="margin-bottom: 30px;">Cliquez sur le lien ci-dessous pour rejoindre la famille ${nameRoom}.</p>
            <a style="padding: 12px;text-decoration: none; background:#4747FF; color:#FAFAFA; border-radius: 12px;margin-bottom: 30px; font-weight: 500" href="${url}">Rejoindre</a>
        </div>
    </body>
    </html>
  `;
  }

  private async sendMailInvitation(
    nameWhoInvite: string,
    email: string,
    url: string,
    nameRoom: string,
  ): Promise<void> {
    const contentMail = this.generateEmailContent(nameWhoInvite, url, nameRoom);
    const mailOptions = {
      from: "noreply@giftsync.fr",
      to: email,
      subject: `Gift Sync - ${nameWhoInvite} vous invite à rejoindre la famille ${nameRoom}`,
      html: contentMail,
    };
    await transport.sendMail(mailOptions);
  }
}
