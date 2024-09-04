"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection = new sequelize_1.Sequelize(process.env.DATABASE_URL ||
    "postgresql://root:root@localhost:5432/noel_listing", {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
});
// Export de la connexion
exports.default = connection;
