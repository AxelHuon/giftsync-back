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
exports.Room = void 0;
const sequelize_1 = require("sequelize");
const slugify_1 = __importDefault(require("slugify"));
const connection_1 = __importDefault(require("../config/connection"));
class Room extends sequelize_1.Model {
    static generateUniqueSlug(title) {
        return __awaiter(this, void 0, void 0, function* () {
            let slug = (0, slugify_1.default)(title, { lower: true });
            let uniqueSlug = slug;
            let count = 1;
            while (yield Room.findOne({ where: { slug: uniqueSlug } })) {
                uniqueSlug = `${slug}-${count++}`;
            }
            return uniqueSlug;
        });
    }
}
exports.Room = Room;
Room.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    ownerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: connection_1.default,
    modelName: "Room",
    hooks: {
        beforeValidate: (room) => __awaiter(void 0, void 0, void 0, function* () {
            if (!room.slug) {
                room.slug = yield Room.generateUniqueSlug(room.title);
            }
        }),
        beforeCreate: (room) => __awaiter(void 0, void 0, void 0, function* () {
            room.slug = yield Room.generateUniqueSlug(room.title);
        }),
        beforeUpdate: (room) => __awaiter(void 0, void 0, void 0, function* () {
            if (room.changed("title")) {
                room.slug = yield Room.generateUniqueSlug(room.title);
            }
        }),
    },
});
exports.default = Room;
