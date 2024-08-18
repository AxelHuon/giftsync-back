import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Room from "../../models/room.model";
import RoomUser from "../../models/roomuser.model";
import User from "../../models/user.model";
import { getToken } from "../auth/auth.middleware";

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

export const addUserToRoom = async (req: Request, res: Response) => {
  try {
    const token = getToken(req.headers);
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

        if (room) {
          const usersOfTheRooms = room.getUsers();

          console.log(usersOfTheRooms);

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
      }
    } else {
      return res.status(401).send({ message: "Unauthorized" });
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

export const deleteUserFromARoom = async (req: Request, res: Response) => {
  try {
    const token = getToken(req.headers);
    const { roomId } = req.params;
    const { userId } = req.body;
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "");
      if (typeof decodedToken === "object" && "id" in decodedToken) {
        const room = await Room.findByPk(roomId);
        if (!userId) {
          return res.status(401).send({ message: "User is required" });
        }
        if (room) {
          if (room.ownerId === decodedToken.id) {
            if (userId === decodedToken.id) {
              return res.status(401).send({
                message:
                  "You can't remove you from the room because you are the owner of this room",
              });
            } else {
              const roomUser = await RoomUser.findOne({
                where: { RoomId: roomId, UserId: userId },
              });
              if (!roomUser) {
                return res
                  .status(404)
                  .json({ message: "User is not associated with this room" });
              } else {
                await roomUser.destroy();
                return res
                  .status(200)
                  .send({ message: "User as been deleted from this room" });
              }
            }
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

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const token = getToken(req.headers);
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
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
