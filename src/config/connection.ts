import { Sequelize } from "sequelize";

require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const connection = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  /*  dialectOptions: {
    ssl: {
      require: false,
      rejectUnauthorized: t,
    },
  },*/
});

// Export de la connexion
export default connection;
