"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection = new sequelize_1.Sequelize(process.env.DATABASE_URL || "", {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
        ssl: {
            require: false,
            rejectUnauthorized: false,
        },
    },
    logging: false,
});
// Export de la connexion
exports.default = connection;
