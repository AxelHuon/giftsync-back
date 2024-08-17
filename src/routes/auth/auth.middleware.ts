import { NextFunction, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
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
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  console.log(token);
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
