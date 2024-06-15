import jwt, { TokenExpiredError } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const catchError = (err: unknown, res: Response) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token expired!" });
  }
  return res.status(401).send({ message: "Unauthorized!" });
};

export const verifyToken = (
  req: Request,
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
    // @ts-ignore
    req?.user = decoded;
    next();
  });
};
