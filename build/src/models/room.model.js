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
exports.RoomModel = void 0;
const slugify_1 = __importDefault(require("slugify"));
const uuid_1 = require("uuid");
const prisma_1 = __importDefault(require("../config/prisma"));
class RoomModel {
}
exports.RoomModel = RoomModel;
_a = RoomModel;
RoomModel.createRoom = (title, ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    let slug = (0, slugify_1.default)(title, { lower: true });
    let uniqueSlug = slug;
    let count = 1;
    while (yield prisma_1.default.rooms.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${count++}`;
    }
    const room = yield prisma_1.default.rooms.create({
        data: {
            id: (0, uuid_1.v4)(),
            title: title,
            slug: uniqueSlug,
            ownerId: ownerId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    });
    yield prisma_1.default.roomUsers.create({
        data: {
            roomId: room.id,
            userId: ownerId,
        },
    });
    return room;
});
RoomModel.putRoom = (title, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    let slug = (0, slugify_1.default)(title, { lower: true });
    let uniqueSlug = slug;
    let count = 1;
    while (yield prisma_1.default.rooms.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${count++}`;
    }
    const room = yield prisma_1.default.rooms.update({
        where: { id: roomId },
        data: {
            title: title,
            slug: uniqueSlug,
            updatedAt: new Date().toISOString(),
        },
    });
    return room;
});
