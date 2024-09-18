import process from "node:process";
import { Sequelize } from "sequelize";

require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const isProduction = process.env.NODE_ENV === "production";

const sslConfig = isProduction
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : {};

const connection = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: sslConfig,
});

// Export de la connexion
export default connection;
