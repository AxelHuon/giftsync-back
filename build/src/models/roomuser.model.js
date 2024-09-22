"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomUser = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../config/connection"));
const room_model_1 = __importDefault(require("./room.model"));
const user_model_1 = __importDefault(require("./user.model"));
class RoomUser extends sequelize_1.Model {
}
exports.RoomUser = RoomUser;
RoomUser.init({
    roomId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: room_model_1.default,
            key: "id",
        },
        field: "roomId",
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: user_model_1.default,
            key: "id",
        },
        field: "userId",
    },
}, {
    sequelize: connection_1.default,
    modelName: "RoomUser",
    tableName: "RoomUsers",
    timestamps: false,
});
exports.default = RoomUser;
