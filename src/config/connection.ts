import { Sequelize } from "sequelize";

require("dotenv").config();

const connection = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
});

// Export de la connexion
export default connection;
