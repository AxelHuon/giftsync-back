"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.deleteUserFromARoom = exports.putNameOfRoom = exports.getSingleRoom = exports.addUserToRoom = exports.createRoom = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const room_model_1 = __importDefault(require("../../models/room.model"));
const roomuser_model_1 = __importDefault(require("../../models/roomuser.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, auth_middleware_1.getToken)(req.headers);
        const { title } = req.body;
        if (token) {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            if (typeof decodedToken === "object" && "id" in decodedToken) {
                const owner = yield user_model_1.default.findOne({ where: { id: decodedToken.id } });
                if (!title) {
                    return res.status(401).send({ message: "Title is required" });
                }
                if (!owner) {
                    return res.status(401).send({ message: "Owner is required" });
                }
                const idRoom = (0, uuid_1.v4)();
                const room = yield room_model_1.default.create({
                    id: idRoom,
                    title: title,
                    ownerId: decodedToken.id,
                });
                const usersOfTheRooms = [];
                usersOfTheRooms.push(owner);
                yield room.addUsers(usersOfTheRooms);
                const roomJustCreated = yield room_model_1.default.findByPk(idRoom, {
                    include: [
                        {
                            model: user_model_1.default,
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
        }
        else {
            return res.status(401).send({ error: "Unauthorized" });
        }
    }
    catch (error) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.createRoom = createRoom;
const addUserToRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, auth_middleware_1.getToken)(req.headers);
        const { usersId } = req.body;
        const { roomId } = req.params;
        if (token) {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            if (typeof decodedToken === "object" && "id" in decodedToken) {
                if (!usersId) {
                    return res.status(401).send({ message: "User is required" });
                }
                if (!roomId) {
                    return res.status(401).send({ message: "Room is required" });
                }
                const room = yield room_model_1.default.findByPk(roomId);
                if (!room) {
                    return res.status(404).send({ message: "Room not found" });
                }
                if (room) {
                    const usersOfTheRooms = room.getUsers();
                    console.log(usersOfTheRooms);
                    let usersToAdd = [];
                    for (let i = 0; i < usersId.length; i++) {
                        const userToAdd = yield user_model_1.default.findOne({ where: { id: usersId[i] } });
                        if (userToAdd) {
                            usersToAdd.push(userToAdd);
                        }
                    }
                    if (usersToAdd && usersToAdd.length > 0) {
                        yield room.addUsers(usersToAdd);
                        return res.status(200).send({ message: "User added to room" });
                    }
                    else {
                        return res.status(404).send({ message: "No users found" });
                    }
                }
            }
        }
        else {
            return res.status(401).send({ message: "Unauthorized" });
        }
    }
    catch (error) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.addUserToRoom = addUserToRoom;
const getSingleRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, auth_middleware_1.getToken)(req.headers);
        const { roomId } = req.params;
        if (token) {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            if (typeof decodedToken === "object" && "id" in decodedToken) {
                if (!roomId) {
                    return res.status(401).send({ message: "Room is required" });
                }
                const room = yield room_model_1.default.findByPk(roomId, {
                    include: [
                        {
                            model: user_model_1.default,
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
        }
        else {
            return res.status(401).send({ message: "Unauthorized" });
        }
    }
    catch (error) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.getSingleRoom = getSingleRoom;
const putNameOfRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, auth_middleware_1.getToken)(req.headers);
        const { roomId } = req.params;
        const { title } = req.body;
        if (token) {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            if (typeof decodedToken === "object" && "id" in decodedToken) {
                const room = yield room_model_1.default.findByPk(roomId);
                if (!title) {
                    return res.status(401).send({ message: "Title is required" });
                }
                if (room) {
                    if (room.ownerId === decodedToken.id) {
                        room.title = title;
                        yield room.save();
                        res.status(200).json(room);
                    }
                    else {
                        return res
                            .status(401)
                            .send({ message: "Your not the owner of the room" });
                    }
                }
                else {
                    return res.status(401).send({ message: "Room is not found" });
                }
            }
        }
        else {
            return res.status(401).send({ message: "Unauthorized" });
        }
    }
    catch (error) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.putNameOfRoom = putNameOfRoom;
const deleteUserFromARoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, auth_middleware_1.getToken)(req.headers);
        const { roomId } = req.params;
        const { userId } = req.body;
        if (token) {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            if (typeof decodedToken === "object" && "id" in decodedToken) {
                const room = yield room_model_1.default.findByPk(roomId);
                if (!userId) {
                    return res.status(401).send({ message: "User is required" });
                }
                if (room) {
                    if (room.ownerId === decodedToken.id) {
                        if (userId === decodedToken.id) {
                            return res.status(401).send({
                                message: "You can't remove you from the room because you are the owner of this room",
                            });
                        }
                        else {
                            const roomUser = yield roomuser_model_1.default.findOne({
                                where: { RoomId: roomId, UserId: userId },
                            });
                            if (!roomUser) {
                                return res
                                    .status(404)
                                    .json({ message: "User is not associated with this room" });
                            }
                            else {
                                yield roomUser.destroy();
                                return res
                                    .status(200)
                                    .send({ message: "User as been deleted from this room" });
                            }
                        }
                    }
                    else {
                        return res
                            .status(401)
                            .send({ message: "Your not the owner of the room" });
                    }
                }
                else {
                    return res.status(401).send({ message: "Room is not found" });
                }
            }
        }
        else {
            return res.status(401).send({ message: "Unauthorized" });
        }
    }
    catch (error) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.deleteUserFromARoom = deleteUserFromARoom;
const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, auth_middleware_1.getToken)(req.headers);
        const { roomId } = req.params;
        if (token) {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
            if (typeof decodedToken === "object" && "id" in decodedToken) {
                if (!roomId) {
                    return res.status(401).send({ message: "Room is required" });
                }
                const room = yield room_model_1.default.findByPk(roomId);
                if (room) {
                    if (room.ownerId !== decodedToken.id) {
                        return res
                            .status(403)
                            .send({ message: "Only owner of the room is allowed to delete" });
                    }
                    else {
                        yield room.destroy();
                        return res.status(200).send({ message: "Room has been deleted" });
                    }
                }
            }
        }
        else {
            return res.status(401).send({ message: "Unauthorized" });
        }
    }
    catch (error) {
        return res.status(500).send({ message: "Internal Server Error" });
    }
});
exports.deleteRoom = deleteRoom;
