import { Sequelize } from "sequelize";

const connection = new Sequelize({
  dialect: "postgres",
  database: process.env.PGDATABASE || "",
  username: process.env.PGUSER || "",
  password: process.env.PGPASSWORD || "",
  host: process.env.PGHOST || "",
});

export default connection;
