import { Sequelize } from "sequelize";

const connection = new Sequelize(process.env.DATABASE_URL || "", {
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
export default connection;
