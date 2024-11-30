import { v4 as uuidv4 } from "uuid";
import prisma from "../config/prisma";

export interface AuthTokenForgotPasswordAttributes {
  id?: string;
  user: string;
  token: string;
  expiryDate: Date;
}

export class AuthTokenForgotPasswordModel {
  static createForgotPasswordToken = async (
    userId: string,
  ): Promise<string> => {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + parseInt("600"));
    let _token = uuidv4();
    let refreshToken = await prisma.authTokenForgotPasswords.create({
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

  static verifyAndDeleteExpiredTokenForgotPassword = async (
    token: AuthTokenForgotPasswordAttributes,
  ): Promise<boolean> => {
    const isExpired = token.expiryDate.getTime() < new Date().getTime();
    if (isExpired) {
      await prisma.authTokenForgotPasswords.delete({
        where: {
          id: token.id,
        },
      });
    }
    return isExpired;
  };
}
