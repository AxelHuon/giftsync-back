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
exports.UserModel = void 0;
const uuid_1 = require("uuid");
const prisma_1 = __importDefault(require("../../config/prisma"));
const bcrypt = require("bcrypt");
class UserModel {
    static createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToCreate = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: yield bcrypt.hash(user.password, 12),
                dateOfBirth: user.dateOfBirth,
                id: (0, uuid_1.v4)(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            return yield prisma_1.default.users.create({
                data: userToCreate,
            });
        });
    }
}
exports.UserModel = UserModel;
