import { NextFunction, Response } from "express";
import AuthtokenModel from "../models/authtoken.model";

export function getToken(headers: any): string | null {
  const authorizationHeader = headers["authorization"];
  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.substring(7, authorizationHeader.length);
  }
  return null;
}

export async function securityMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = getToken(req.headers);
  if (!token) {
    return res
      .status(401)
      .send({ message: "Unauthorized", code: "token_missing" });
  }
  const isGoodToken = AuthtokenModel.findOne({ where: { token: token } });
  if (!isGoodToken) {
    return res
      .status(401)
      .send({ message: "Unauthorized", code: "token_invalid" });
  }
  next();
}
