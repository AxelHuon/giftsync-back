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
const mailConfig_1 = __importDefault(require("../../config/mailConfig"));
const prisma_1 = __importDefault(require("../../config/prisma"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const room_model_1 = require("../../models/room.model");
const tokenInviteRoom_model_1 = require("../../models/tokenInviteRoom.model");
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
                const owner = yield prisma_1.default.users.findUnique({
                    where: { id: verifiedToken.id },
                });
                if (!owner) {
                    return errorResponse(404, {
                        message: "UserModel not found",
                        code: "user_not_found",
                    });
                }
                const { title, emails } = body;
                if (!title) {
                    return errorResponse(422, {
                        message: "Title is required",
                        code: "title_required",
                    });
                }
                const newRoom = yield room_model_1.RoomModel.createRoom(title, verifiedToken.id);
                if (emails && emails.length > 0) {
                    const invitedUsers = [];
                    const nameWhoInvite = owner.firstName + " " + owner.lastName;
                    for (const email of emails) {
                        const roomInviteToken = yield tokenInviteRoom_model_1.TokenInviteRoomModel.createTokenInviteRoom(newRoom.id, email);
                        const url = `${process.env.FRONTEND_URL}/families/join/${roomInviteToken}`;
                        yield this.sendMailInvitation(nameWhoInvite, email, url, newRoom.title);
                        invitedUsers.push({ roomInviteToken: url });
                    }
                }
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
    inviteUsersToARoom(req, body, errorResponse) {
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
                const userWhoInvite = yield prisma_1.default.users.findUnique({
                    where: { id: verifiedToken.id },
                });
                if (!userWhoInvite) {
                    return errorResponse(404, {
                        message: "User not found",
                        code: "user_not_found",
                    });
                }
                const { emails, roomId } = body;
                if (!emails || emails.length === 0) {
                    return errorResponse(422, {
                        message: "Emails are required",
                        code: "emails_required",
                    });
                }
                if (!roomId) {
                    return errorResponse(422, {
                        message: "RoomId is required",
                        code: "room_id_required",
                    });
                }
                const room = yield prisma_1.default.rooms.findUnique({
                    where: { id: roomId },
                    include: { RoomUsers: true },
                });
                if (!room) {
                    return errorResponse(404, {
                        message: "Room not found",
                        code: "room_not_found",
                    });
                }
                if (!room.RoomUsers.find((u) => u.userId === userWhoInvite.id)) {
                    return errorResponse(401, {
                        message: "Unauthorized",
                        code: "unauthorized",
                    });
                }
                const invitedUsers = [];
                const nameWhoInvite = userWhoInvite.firstName + " " + userWhoInvite.lastName;
                for (const email of emails) {
                    const roomInviteToken = yield tokenInviteRoom_model_1.TokenInviteRoomModel.createTokenInviteRoom(room.id, email);
                    const url = `${process.env.FRONTEND_URL}/families/join/${roomInviteToken}`;
                    yield this.sendMailInvitation(nameWhoInvite, email, url, room.title);
                    invitedUsers.push({ roomInviteToken: url });
                }
                this.setStatus(200);
                return { invitedUsers };
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
                const user = yield prisma_1.default.users.findUnique({ where: { email } });
                if (!user) {
                    return errorResponse(404, {
                        message: "UserModel not found",
                        code: "user_not_found",
                    });
                }
                const tokenInvite = yield prisma_1.default.inviteTokenRooms.findUnique({
                    where: { token },
                });
                if (!tokenInvite) {
                    return errorResponse(400, {
                        message: "Invalid or expired token",
                        code: "invalid_token",
                    });
                }
                const isExpired = yield tokenInviteRoom_model_1.TokenInviteRoomModel.verifyAndDeleteTokenInviteRoom(tokenInvite);
                if (!isExpired) {
                    const room = yield prisma_1.default.rooms.findUnique({
                        where: { id: tokenInvite.room },
                        include: { RoomUsers: true },
                    });
                    if (!room) {
                        return errorResponse(404, {
                            message: "Room not found",
                            code: "room_not_found",
                        });
                    }
                    if (room.RoomUsers.find((u) => u.userId === user.id)) {
                        return errorResponse(400, {
                            message: "UserModel already in room",
                            code: "user_already_in_room",
                        });
                    }
                    /*Add User To the room*/
                    yield prisma_1.default.roomUsers.create({
                        data: {
                            roomId: room.id,
                            userId: user.id,
                        },
                    });
                    yield prisma_1.default.inviteTokenRooms.delete({ where: { token } });
                    this.setStatus(200);
                    return {
                        message: "Successfully joined the room",
                        code: "success",
                        roomSlug: room.slug,
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
                const user = yield prisma_1.default.users.findUnique({
                    where: { id: verifiedToken.id },
                });
                if (!user) {
                    return errorResponse(404, {
                        message: "UserModel not found",
                        code: "user_not_found",
                    });
                }
                const room = yield prisma_1.default.rooms.findUnique({ where: { id: roomId } });
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
                yield prisma_1.default.rooms.delete({ where: { id: roomId } });
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
    putRoom(req, roomId, body, errorResponse) {
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
                const user = yield prisma_1.default.users.findUnique({
                    where: { id: verifiedToken.id },
                });
                if (!user) {
                    return errorResponse(404, {
                        message: "UserModel not found",
                        code: "user_not_found",
                    });
                }
                const room = yield prisma_1.default.rooms.findUnique({ where: { id: roomId } });
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
                const updatedRoom = yield room_model_1.RoomModel.putRoom(title, roomId);
                this.setStatus(200);
                return updatedRoom;
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
    deleteUserFromARoom(req, roomId, userId, errorResponse) {
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
                const user = yield prisma_1.default.users.findUnique({
                    where: { id: verifiedToken.id },
                });
                if (!user) {
                    return errorResponse(404, {
                        message: "UserModel not found",
                        code: "user_not_found",
                    });
                }
                const room = yield prisma_1.default.rooms.findUnique({ where: { id: roomId } });
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
                yield prisma_1.default.roomUsers.delete({
                    where: {
                        roomId_userId: {
                            roomId,
                            userId,
                        },
                    },
                });
                this.setStatus(200);
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
    getRoomBySlug(roomSlug, req, errorResponse) {
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
                const user = yield prisma_1.default.users.findUnique({
                    where: { id: verifiedToken.id },
                });
                if (!user) {
                    return errorResponse(404, {
                        message: "UserModel not found",
                        code: "user_not_found",
                    });
                }
                const room = yield prisma_1.default.rooms.findUnique({
                    where: { slug: roomSlug },
                    include: {
                        RoomUsers: {
                            include: {
                                Users: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        id: true,
                                        profilePicture: true,
                                    },
                                },
                            },
                        },
                    },
                });
                if (!room) {
                    return errorResponse(404, {
                        message: "Room not found",
                        code: "room_not_found",
                    });
                }
                if (!room.RoomUsers.find((u) => u.userId === user.id)) {
                    return errorResponse(401, {
                        message: "Unauthorized",
                        code: "unauthorized",
                    });
                }
                const isOwner = room.ownerId === user.id;
                const transformedRooms = Object.assign(Object.assign({}, room), { users: room.RoomUsers.map((roomUser) => roomUser.Users), isOwner });
                this.setStatus(200);
                delete transformedRooms.RoomUsers;
                return transformedRooms;
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
    generateEmailContent(nameWhoInvite, url, nameRoom) {
        return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gift Sync - Réinitialisation de votre mot de passe</title>
    </head>
    <body style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA; color: #1F1F1F;">
        <div style="text-align: center; padding-top: 20px; padding-bottom: 20px;">
            <img src="https://www.giftsync.fr/images/gslogo.png" alt="Logo" style="width: 200px; max-width: 100%; height: auto; margin-bottom: 20px;">
            <h1 style="color: #4747FF; margin: 0; font-size: 24px; font-weight: bold;">${nameWhoInvite} vous invite à rejoindre la famille ${nameRoom}</h1>
        </div>
        <div style="text-align: center; padding-top: 20px;">
            <p style="margin-bottom: 15px;">Bonjour,</p>
            <p style="margin-bottom: 30px;">Cliquez sur le lien ci-dessous pour rejoindre la famille ${nameRoom}.</p>
            <a style="padding: 12px;text-decoration: none; background:#4747FF; color:#FAFAFA; border-radius: 12px;margin-bottom: 30px; font-weight: 500" href="${url}">Rejoindre</a>
        </div>
    </body>
    </html>
  `;
    }
    sendMailInvitation(nameWhoInvite, email, url, nameRoom) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentMail = this.generateEmailContent(nameWhoInvite, url, nameRoom);
            const mailOptions = {
                from: "noreply@giftsync.fr",
                to: email,
                subject: `Gift Sync - ${nameWhoInvite} vous invite à rejoindre la famille ${nameRoom}`,
                html: contentMail,
            };
            yield mailConfig_1.default.sendMail(mailOptions);
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
    (0, tsoa_1.Post)("invite-users"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(room_interface_1.InviteUserRequest)]),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Res)())
], RoomController.prototype, "inviteUsersToARoom", null);
__decorate([
    (0, tsoa_1.Post)("join/:token"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(room_interface_1.JoinRoomRequest)]),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Res)())
], RoomController.prototype, "joinRoom", null);
__decorate([
    (0, tsoa_1.Delete)(":roomId/delete"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Res)())
], RoomController.prototype, "deleteRoom", null);
__decorate([
    (0, tsoa_1.Put)(":roomId/update"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    (0, tsoa_1.Middlewares)([(0, validation_middleware_1.validationBodyMiddleware)(room_interface_1.CreateRoomRequest)]),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Body)()),
    __param(3, (0, tsoa_1.Res)())
], RoomController.prototype, "putRoom", null);
__decorate([
    (0, tsoa_1.Delete)(":roomId/user/:userId"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    __param(0, (0, tsoa_1.Request)()),
    __param(1, (0, tsoa_1.Path)()),
    __param(2, (0, tsoa_1.Path)()),
    __param(3, (0, tsoa_1.Res)())
], RoomController.prototype, "deleteUserFromARoom", null);
__decorate([
    (0, tsoa_1.Get)("{roomSlug}"),
    (0, tsoa_1.Middlewares)(auth_middleware_1.securityMiddleware),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __param(2, (0, tsoa_1.Res)())
], RoomController.prototype, "getRoomBySlug", null);
exports.RoomController = RoomController = __decorate([
    (0, tsoa_1.Tags)("Room"),
    (0, tsoa_1.Route)("room")
], RoomController);
