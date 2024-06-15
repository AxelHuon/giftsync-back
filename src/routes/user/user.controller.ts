import { Request, Response } from "express";
import User from "../../models/user.model";
import jwt from "jsonwebtoken";
import { ApiError } from "../api";
import { BodyGetApiUserMeResponse } from "./userApi";

export const getMe = async (
  req: Request,
  res: Response<BodyGetApiUserMeResponse | ApiError>,
) => {
  try {
    const token = req.headers["authorization"];
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

export const getRoomOfUserConnected = async (req: Request, res: Response) => {
  try {
    const token = req.headers["authorization"];
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
      if (typeof decodedToken === "object" && "id" in decodedToken) {
        const user = await User.findOne({
          where: { id: decodedToken.id },
          attributes: { exclude: ["password"] },
        });

        if (user) {
          const rooms = await user.getRooms();
          res.status(200).send(rooms);
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
