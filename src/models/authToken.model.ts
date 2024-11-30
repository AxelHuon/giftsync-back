import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";

export interface AuthTokenAttributes {
  id?: string;
  user: string;
  token: string;
  expiryDate: Date;
}

export class AuthTokenModel {
  static createToken = async (userId: string): Promise<string> => {
    let expiredAt = new Date();
    expiredAt.setSeconds(
      expiredAt.getSeconds() +
        parseInt(process.env.JWT_REFRESH_EXPIRATION || "0"),
    );
    let _token = uuidv4();
    let refreshToken = await prisma.authTokens.create({
      data: {
        token: _token,
        user: userId,
        expiryDate: expiredAt,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    return refreshToken.token;
  };

  static verifyAndDeleteExpiredToken = async (
    token: AuthTokenAttributes,
  ): Promise<boolean> => {
    const isExpired = token.expiryDate.getTime() < new Date().getTime();
    if (isExpired) {
      await prisma.authTokens.delete({
        where: {
          id: token.id,
        },
      });
    }
    return isExpired;
  };
}
