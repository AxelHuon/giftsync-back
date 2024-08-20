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
exports.AuthtokenModel = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const connection_1 = __importDefault(require("../config/connection"));
class AuthtokenModel extends sequelize_1.Model {
    static associate(models) {
        _a.belongsTo(models.User, {
            foreignKey: "user",
            as: "user_id",
        });
    }
}
exports.AuthtokenModel = AuthtokenModel;
_a = AuthtokenModel;
AuthtokenModel.createToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() +
        parseInt(process.env.JWT_REFRESH_EXPIRATION || "0"));
    let _token = (0, uuid_1.v4)();
    let refreshToken = yield _a.create({
        token: _token,
        user: user.id,
        expiryDate: expiredAt,
    });
    return refreshToken.dataValues.token;
});
AuthtokenModel.verifyExpiration = (token) => {
    return token.dataValues.expiryDate.getTime() < new Date().getTime();
};
AuthtokenModel.verifyAndDeleteExpiredToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const isExpired = token.dataValues.expiryDate.getTime() < new Date().getTime();
    if (isExpired) {
        yield _a.destroy({ where: { id: token.id } });
    }
    return isExpired;
});
AuthtokenModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    user: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    expiryDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: connection_1.default,
    modelName: "authToken",
});
exports.default = AuthtokenModel;
