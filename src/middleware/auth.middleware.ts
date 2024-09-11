import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
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
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
  if (typeof decodedToken !== "object" || !("id" in decodedToken)) {
    return res
      .status(401)
      .send({ message: "Unauthorized", code: "token_invalid" });
  }

  const isGoodToken = await AuthtokenModel.findOne({
    where: { user: decodedToken.id },
  });

  if (!isGoodToken) {
    return res
      .status(401)
      .send({ message: "Unauthorized", code: "token_invalid" });
  }

  const isExpired =
    await AuthtokenModel.verifyAndDeleteExpiredToken(isGoodToken);

  if (isExpired) {
    return res
      .status(401)
      .send({ message: "Unauthorized", code: "token_expired" });
  }

  next();
}
