"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_process_1 = __importDefault(require("node:process"));
const sequelize_1 = require("sequelize");
require("dotenv").config();
if (!node_process_1.default.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
}
const isProduction = node_process_1.default.env.NODE_ENV === "production";
const sslConfig = isProduction
    ? {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    }
    : {};
const connection = new sequelize_1.Sequelize(node_process_1.default.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: sslConfig,
});
// Export de la connexion
exports.default = connection;
