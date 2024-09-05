"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
require("dotenv").config();
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
}
const connection = new sequelize_1.Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true, // Forces SSL connection
            rejectUnauthorized: false, // Disable rejection of unauthorized SSL certificates (optional, but useful for Heroku)
        },
    },
});
// Export de la connexion
exports.default = connection;
