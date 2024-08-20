"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection = new sequelize_1.Sequelize(process.env.DATABASE_URL ||
    "postgres://u2d6ng7r83d2ai:pff8c2940814f05d4ec1f0e733754757d30b1b93b9eee4fc854cdd95aaf7aa594@c724r43q8jp5nk.cluster-czz5s0kz4scl.eu-west-1.rds.amazonaws.com:5432/d5jgbs0ud4o0an", {
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
