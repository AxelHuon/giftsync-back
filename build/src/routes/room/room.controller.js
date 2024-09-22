"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.RoomController = void 0;
const tsoa_1 = require("tsoa");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const room_model_1 = __importDefault(require("../../models/room.model"));
const tokenInviteRoom_model_1 = __importDefault(require("../../models/tokenInviteRoom.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const room_interface_1 = require("./room.interface");
require("dotenv").config();
let RoomController = class RoomController extends tsoa_1.Controller {
    createRoom(req, body, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, auth_middleware_1.getToken)(req.headers);
                const verifiedToken = yield (0, auth_middleware_1.jwtVerify)(token);
                if ("code" in verifiedToken) {
                    return errorResponse(401, {
                        message: verifiedToken.message,
                        code: verifiedToken.code,
                    });
                }
                const owner = yield user_model_1.default.findOne({ where: { id: verifiedToken.id } });
                if (!owner) {
                    return errorResponse(404, {
                        message: "User not found",
                        code: "user_not_found",
                    });
                }
                const { title } = body;
                if (!title) {
                    return errorResponse(422, {
                        message: "Title is required",
                        code: "title_required",
                    });
                }
                const newRoom = yield room_model_1.default.create({
                    title,
                    ownerId: verifiedToken.id,
                });
                yield newRoom.addUsers([owner]);
                this.setStatus(200);
                return newRoom;
            }
            catch (error) {
                console.log(error);
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
    inviteUser(req, body, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, auth_middleware_1.getToken)(req.headers);
                const verifiedToken = yield (0, auth_middleware_1.jwtVerify)(token);
                if ("code" in verifiedToken) {
                    return errorResponse(401, {
                        message: verifiedToken.message,
                        code: verifiedToken.code,
                    });
                }
                const user = yield user_model_1.default.findOne({ where: { id: verifiedToken.id } });
                if (!user) {
                    return errorResponse(404, {
                        message: "User not found",
                        code: "user_not_found",
                    });
                }
                const { email, roomId } = body;
                if (!email) {
                    return errorResponse(422, {
                        message: "Email is required",
                        code: "email_required",
                    });
                }
                if (!roomId) {
                    return errorResponse(422, {
                        message: "RoomId is required",
                        code: "room_id_required",
                    });
                }
                const room = yield room_model_1.default.findOne({ where: { id: roomId } });
                if (!room) {
                    return errorResponse(404, {
                        message: "Room not found",
                        code: "room_not_found",
                    });
                }
                room.getUsers().then((users) => {
                    if (!users.find((u) => u.id === user.id)) {
                        return errorResponse(401, {
                            message: "Unauthorized",
                            code: "unauthorized",
                        });
                    }
                });
                const roomInviteToken = yield tokenInviteRoom_model_1.default.createToken(room);
                const url = `${process.env.FRONTEND_URL}/room/join/${roomInviteToken}`;
                this.setStatus(200);
                return {
                    roomInviteToken: url,
                };
            }
            catch (error) {
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
    joinRoom(token, body, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = body;
                if (!email) {
                    return errorResponse(422, {
                        message: "Email is required",
                        code: "email_required",
                    });
                }
                if (!token) {
                    return errorResponse(422, {
                        message: "Token is required",
                        code: "token_required",
                    });
                }
                const user = yield user_model_1.default.findOne({ where: { email } });
                if (!user) {
                    return errorResponse(404, {
                        message: "User not found",
                        code: "user_not_found",
                    });
                }
                const tokenInvite = yield tokenInviteRoom_model_1.default.findOne({
                    where: { token },
                });
                if (!tokenInvite) {
                    return errorResponse(400, {
                        message: "Invalid or expired token",
                        code: "invalid_token",
                    });
                }
                const isExpired = yield tokenInviteRoom_model_1.default.verifyAndDeleteExpiredToken(tokenInvite);
                if (!isExpired) {
                    const room = yield room_model_1.default.findOne({ where: { id: tokenInvite.room } });
                    if (!room) {
                        return errorResponse(404, {
                            message: "Room not found",
                            code: "room_not_found",
                        });
                    }
                    const users = yield room.getUsers();
                    if (users.find((u) => u.id === user.id)) {
                        return errorResponse(400, {
                            message: "User already in room",
                            code: "user_already_in_room",
                        });
                    }
                    yield room.addUsers([user]);
                    this.setStatus(200);
                    return {
                        message: "Successfully joined the room",
                        roomId: room.id,
                    };
                }
                else {
                    return errorResponse(400, {
                        message: "Invalid or expired token",
                        code: "invalid_token",
                    });
                }
            }
            catch (error) {
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
    deleteRoom(req, roomId, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, auth_middleware_1.getToken)(req.headers);
                const verifiedToken = yield (0, auth_middleware_1.jwtVerify)(token);
                if ("code" in verifiedToken) {
                    return errorResponse(401, {
                        message: verifiedToken.message,
                        code: verifiedToken.code,
                    });
                }
                const user = yield user_model_1.default.findOne({ where: { id: verifiedToken.id } });
                if (!user) {
                    return errorResponse(404, {
                        message: "User not found",
                        code: "user_not_found",
                    });
                }
                const room = yield room_model_1.default.findOne({ where: { id: roomId } });
                if (!room) {
                    return errorResponse(404, {
                        message: "Room not found",
                        code: "room_not_found",
                    });
                }
                if (room.ownerId !== user.id) {
                    return errorResponse(401, {
                        message: "Unauthorized",
                        code: "unauthorized",
                    });
                }
                yield room.destroy();
                this.setStatus(200);
                return room;
            }
            catch (error) {
                console.log("error", error);
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
    /*Put title of a Room*/
    updateRoom(req, roomId, body, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, auth_middleware_1.getToken)(req.headers);
                const verifiedToken = yield (0, auth_middleware_1.jwtVerify)(token);
                if ("code" in verifiedToken) {
                    return errorResponse(401, {
                        message: verifiedToken.message,
                        code: verifiedToken.code,
                    });
                }
                const user = yield user_model_1.default.findOne({ where: { id: verifiedToken.id } });
                if (!user) {
                    return errorResponse(404, {
                        message: "User not found",
                        code: "user_not_found",
                    });
                }
                const room = yield room_model_1.default.findOne({ where: { id: roomId } });
                if (!room) {
                    return errorResponse(404, {
                        message: "Room not found",
                        code: "room_not_found",
                    });
                }
                if (room.ownerId !== user.id) {
                    return errorResponse(401, {
                        message: "Unauthorized",
                        code: "unauthorized",
                    });
                }
                const { title } = body;
                if (!title) {
                    return errorResponse(422, {
                        message: "Title is required",
                        code: "title_required",
                    });
                }
                room.title = title;
                yield room.save();
                this.setStatus(200);
                return room;
            }
            catch (error) {
                console.log("error", error);
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
    /*Get room by id*/
    getRoomById(roomId, req, errorResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = (0, auth_middleware_1.getToken)(req.headers);
                const verifiedToken = yield (0, auth_middleware_1.jwtVerify)(token);
                if ("code" in verifiedToken) {
                    return errorResponse(401, {
                        message: verifiedToken.message,
                        code: verifiedToken.code,
                    });
                }
                const user = yield user_model_1.default.findOne({ where: { id: verifiedToken.id } });
                if (!user) {
                    return errorResponse(404, {
                        message: "User not found",
                        code: "user_not_found",
                    });
                }
                const room = yield room_model_1.default.findOne({ where: { id: roomId } });
                if (!room) {
                    return errorResponse(404, {
                        message: "Room not found",
                        code: "room_not_found",
                    });
                }
                const usersOfTheRoom = yield room.getUsers();
                if (!usersOfTheRoom.find((u) => u.id === user.id)) {
                    return errorResponse(401, {
                        message: "Unauthorized",
                        code: "unauthorized",
                    });
                }
                this.setStatus(200);
                return room;
            }
            catch (error) {
                console.log("error", error);
                return errorResponse(500, {
                    message: "Internal Server Error",
                    code: "internal_server_error",
                });
            }
        });
    }
};
exports.RoomController = RoomController;
__decorate([
    (0, tsoa_1.Post)("create"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(room_interface_1.CreateRoomRequest)]),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Res)())
], RoomController.prototype, "createRoom", null);
__decorate([
    (0, tsoa_1.Post)("invite-user"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(room_interface_1.InviteUserRequest)]),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Res)())
], RoomController.prototype, "inviteUser", null);
__decorate([
    (0, tsoa_1.Post)("join/:token"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(room_interface_1.JoinRoomRequest)]),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Res)())
], RoomController.prototype, "joinRoom", null);
__decorate([
    (0, tsoa_1.Delete)("delete/:roomId"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Res)())
], RoomController.prototype, "deleteRoom", null);
__decorate([
    (0, tsoa_1.Put)("update/:roomId"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(room_interface_1.CreateRoomRequest)]),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __param(3, (0, tsoa_1.Res)())
], RoomController.prototype, "updateRoom", null);
__decorate([
    (0, tsoa_1.Get)("{roomId}"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __param(2, (0, tsoa_1.Res)())
], RoomController.prototype, "getRoomById", null);
exports.RoomController = RoomController = __decorate([
    (0, tsoa_1.Tags)("Room"),
    (0, tsoa_1.Route)("room")
], RoomController);
