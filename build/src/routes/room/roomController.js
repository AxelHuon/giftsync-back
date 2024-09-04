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
exports.putNameOfRoom = exports.getSingleRoom = exports.createRoom = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const room_model_1 = __importDefault(require("../../models/room.model"));
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
