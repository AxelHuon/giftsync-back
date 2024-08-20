"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../config/connection"));
const gift_model_1 = __importDefault(require("./gift.model"));
const user_model_1 = __importDefault(require("./user.model"));
class GiftDonor extends sequelize_1.Model {
}
GiftDonor.init({
    giftId: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: gift_model_1.default,
            key: "id",
        },
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: user_model_1.default,
            key: "id",
        },
        primaryKey: true,
    },
    percentage: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize: connection_1.default,
    modelName: "GiftDonor",
});
exports.default = GiftDonor;
