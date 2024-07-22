import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Room from "../../models/room.model";
import User from "../../models/user.model";

export const createRoomController = async (req: Request, res: Response) => {
  try {
    const token = req.headers["authorization"];
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
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const addUserToRoom = async (req: Request, res: Response) => {
  try {
    const token = req.headers["authorization"];
    const { usersId } = req.body;
    const { roomId } = req.params;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
      if (typeof decodedToken === "object" && "id" in decodedToken) {
        if (!usersId) {
          return res.status(401).send({ message: "User is required" });
        }
        if (!roomId) {
          return res.status(401).send({ message: "Room is required" });
        }

        const room = await Room.findByPk(roomId);

        if (!room) {
          return res.status(404).send({ message: "Room not found" });
        }
        let usersToAdd: User[] = [];
        for (let i = 0; i < usersId.length; i++) {
          const userToAdd = await User.findOne({ where: { id: usersId[i] } });
          if (userToAdd) {
            usersToAdd.push(userToAdd);
          }
        }
        if (usersToAdd && usersToAdd.length > 0) {
          await room.addUsers(usersToAdd);
          return res.status(200).send({ message: "User added to room" });
        } else {
          return res.status(404).send({ message: "No users found" });
        }
      }
    } else {
      return res.status(401).send({ message: "Unauthorized" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const getSingleRoom = async (req: Request, res: Response) => {
  try {
    const token = req.headers["authorization"];
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
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const token = req.headers["authorization"];
    const { roomId } = req.params;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
      if (typeof decodedToken === "object" && "id" in decodedToken) {
        if (!roomId) {
          return res.status(401).send({ message: "Room is required" });
        }
        const room = await Room.findByPk(roomId);
        if (room) {
          if (room.ownerId !== decodedToken.id) {
            return res
              .status(403)
              .send({ message: "Only owner of the room is allowed to delete" });
          } else {
            await room.destroy();
            return res.status(200).send({ message: "Room has been deleted" });
          }
        }
      }
    } else {
      return res.status(401).send({ message: "Unauthorized" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
