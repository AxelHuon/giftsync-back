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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInviteRoomModel = void 0;
const uuid_1 = require("uuid");
const prisma_1 = __importDefault(require("../config/prisma"));
class TokenInviteRoomModel {
}
exports.TokenInviteRoomModel = TokenInviteRoomModel;
_a = TokenInviteRoomModel;
TokenInviteRoomModel.createTokenInviteRoom = (roomId, emailToInvite) => __awaiter(void 0, void 0, void 0, function* () {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + parseInt("7200"));
    let _token = (0, uuid_1.v4)();
    yield prisma_1.default.inviteTokenRooms.delete({
        where: { emailToAccept: emailToInvite },
    });
    let refreshToken = yield prisma_1.default.inviteTokenRooms.create({
        data: {
            token: _token,
            emailToAccept: emailToInvite,
            room: roomId,
            expiryDate: expiredAt,
            id: (0, uuid_1.v4)(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    });
    return refreshToken.token;
});
TokenInviteRoomModel.verifyAndDeleteTokenInviteRoom = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const isExpired = token.expiryDate.getTime() < new Date().getTime();
    if (isExpired) {
        yield prisma_1.default.inviteTokenRooms.delete({
            where: {
                id: token.id,
            },
        });
    }
    return isExpired;
});
