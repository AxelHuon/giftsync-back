import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/user.model";
import { getToken } from "../auth/auth.middleware";

export const getMe = async (req: Request, res: Response) => {
  try {
    const token = getToken(req.headers);
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
      if (typeof decodedToken === "object" && "id" in decodedToken) {
        const user = await User.findOne({
          where: { id: decodedToken.id },
          attributes: { exclude: ["password"] },
        });
        if (user) {
          res.status(200).send(user);
        } else {
          res.status(404).send({ statusCode: 500, message: "User not found" });
        }
      }
    }
  } catch (err) {
    res
      .status(500)
      .send({ statusCode: 500, message: "Sorry an error occurred." });
  }
};

export const getRoomOfUserConnected = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = getToken(req.headers);
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
      if (typeof decodedToken === "object" && "id" in decodedToken) {
        const user = await User.findOne({
          where: { id: decodedToken.id },
          attributes: { exclude: ["password"] },
        });

        if (user) {
          const rooms = await user.getRooms({
            include: [
              {
                model: User,
                as: "users",
                through: {
                  attributes: [],
                },
              },
            ],
            attributes: { exclude: ["createdAt", "updatedAt"] },
          });

          res.status(200).send(rooms);
        } else {
          res.status(404).send({ statusCode: 500, message: "User not found" });
        }
      }
    } else {
      res.status(403).send({ message: "No token provided!" });
    }
  } catch (err) {
    next(err);
  }
};
