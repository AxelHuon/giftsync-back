"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gift_model_1 = __importDefault(require("./gift.model"));
const giftdonor_model_1 = __importDefault(require("./giftdonor.model"));
const list_model_1 = __importDefault(require("./list.model"));
const room_model_1 = __importDefault(require("./room.model"));
const roomuser_model_1 = __importDefault(require("./roomuser.model"));
const user_model_1 = __importDefault(require("./user.model"));
room_model_1.default.belongsToMany(user_model_1.default, {
    through: roomuser_model_1.default,
    foreignKey: "RoomId",
    as: "users",
});
user_model_1.default.belongsToMany(room_model_1.default, {
    through: roomuser_model_1.default,
    foreignKey: "UserId",
    as: "rooms",
});
user_model_1.default.belongsToMany(gift_model_1.default, {
    through: giftdonor_model_1.default,
    foreignKey: "userId",
    as: "donatedGifts",
});
list_model_1.default.belongsTo(user_model_1.default, { foreignKey: "ownerId", as: "owner" });
list_model_1.default.belongsTo(room_model_1.default, { foreignKey: "roomId", as: "room" });
gift_model_1.default.belongsTo(list_model_1.default, { foreignKey: "listId", as: "list" });
gift_model_1.default.belongsToMany(user_model_1.default, {
    through: giftdonor_model_1.default,
    foreignKey: "giftId",
    as: "donors",
});
