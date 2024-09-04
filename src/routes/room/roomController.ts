import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { getToken } from "../../middleware/auth.middleware";
import Room from "../../models/room.model";
import User from "../../models/user.model";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const token = getToken(req.headers);
    const { title } = req.body;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
      if (typeof decodedToken === "object" && "id" in decodedToken) {
        const owner = await User.findOne({ where: { id: decodedToken.id } });
        if (!title) {
          return res.status(401).send({ message: "Title is required" });
        }
        if (!owner) {
          return res.status(401).send({ message: "Owner is required" });
        }

        const idRoom = uuidv4();
        const room = await Room.create({
          id: idRoom,
          title: title,
          ownerId: decodedToken.id,
        });

        const usersOfTheRooms = [];
        usersOfTheRooms.push(owner);

        await room.addUsers(usersOfTheRooms);

        const roomJustCreated = await Room.findByPk(idRoom, {
          include: [
            {
              model: User,
              as: "users",
              through: {
                attributes: [],
              },
              attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
              },
            },
          ],
        });
        res.status(200).send(roomJustCreated);
      }
    } else {
      return res.status(401).send({ error: "Unauthorized" });
    }
  } catch (error: any) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getSingleRoom = async (req: Request, res: Response) => {
  try {
    const token = getToken(req.headers);
    const { roomId } = req.params;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
      if (typeof decodedToken === "object" && "id" in decodedToken) {
        if (!roomId) {
          return res.status(401).send({ message: "Room is required" });
        }
        const room = await Room.findByPk(roomId, {
          include: [
            {
              model: User,
              as: "users",
              through: {
                attributes: [],
              },
            },
          ],
        });

        if (!room) {
          return res.status(404).send({ message: "Room not found" });
        }

        return res.status(200).send({ room });
      }
    } else {
      return res.status(401).send({ message: "Unauthorized" });
    }
  } catch (error: any) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const putNameOfRoom = async (req: Request, res: Response) => {
  try {
    const token = getToken(req.headers);
    const { roomId } = req.params;
    const { title } = req.body;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
      if (typeof decodedToken === "object" && "id" in decodedToken) {
        const room = await Room.findByPk(roomId);
        if (!title) {
          return res.status(401).send({ message: "Title is required" });
        }
        if (room) {
          if (room.ownerId === decodedToken.id) {
            room.title = title;
            await room.save();
            res.status(200).json(room);
          } else {
            return res
              .status(401)
              .send({ message: "Your not the owner of the room" });
          }
        } else {
          return res.status(401).send({ message: "Room is not found" });
        }
      }
    } else {
      return res.status(401).send({ message: "Unauthorized" });
    }
  } catch (error: any) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
