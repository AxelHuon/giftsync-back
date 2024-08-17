import { Sequelize } from "sequelize";

const connection = new Sequelize(
  process.env.DATABASE_URL ||
    "postgres://u3kpgsoe4mptt2:p1e8f68b4b0f31e3667e7201dbf3e2ea444826636344d7bacf4bb04dfd5ea56e7@c6sfjnr30ch74e.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/d9la8okja9u72v",
  {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
);

// Export de la connexion
export default connection;
