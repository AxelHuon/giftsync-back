import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";

export interface TokenInviteRoomAttributes {
  id?: string;
  token: string;
  expiryDate: Date;
  emailToAccept: string;
}

export class TokenInviteRoomModel {
  static createTokenInviteRoom = async (
    roomId: string,
    emailToInvite: string,
  ): Promise<string> => {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + parseInt("7200"));
    let _token = uuidv4();
    let refreshToken = await prisma.inviteTokenRooms.create({
      data: {
        token: _token,
        emailToAccept: emailToInvite,
        room: roomId,
        expiryDate: expiredAt,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    return refreshToken.token;
  };

  static verifyAndDeleteTokenInviteRoom = async (
    token: TokenInviteRoomAttributes,
  ): Promise<boolean> => {
    const isExpired = token.expiryDate.getTime() < new Date().getTime();
    if (isExpired) {
      await prisma.inviteTokenRooms.delete({
        where: {
          id: token.id,
        },
      });
    }
    return isExpired;
  };
}
