import {Sequelize} from "sequelize";


const connection = new Sequelize(process.env.DATABASE_URL || "postgresql://root:root@localhost:5432/noel_listing", {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
});

// Export de la connexion
export default connection;

