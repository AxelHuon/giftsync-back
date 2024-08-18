import { NextFunction, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { IncomingHttpHeaders } from "node:http";
import { RequestAuth } from "./authTypes";

const catchError = (err: unknown, res: Response) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token expired!" });
  }
  return res.status(401).send({ message: "Unauthorized!" });
};

export const verifyToken = (
  req: RequestAuth,
  res: Response,
  next: NextFunction,
) => {
  let authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    return res
      .status(403)
      .send({ message: "No token provided!", code: "no_token_provided" });
  }

  if (authorizationHeader.startsWith("Bearer ")) {
    authorizationHeader = authorizationHeader.slice(
      7,
      authorizationHeader.length,
    );
  } else {
    return res
      .status(403)
      .send({ message: "No token provided!", code: "no_token_provided" });
  }

  const token = authorizationHeader;
  const secretKey = process.env.JWT_SECRET;
  jwt.verify(token, secretKey ?? "", (err: unknown, decoded: any) => {
    if (err) {
      console.log(err);
      return catchError(err, res);
    }
    if (req && req) {
      req.user = decoded;
    }
    next();
  });
};

export const getToken = (headers: IncomingHttpHeaders): string | undefined => {
  let authorizationHeader = headers["authorization"];
  if (authorizationHeader) {
    return authorizationHeader.slice(7, authorizationHeader.length);
  }
};
