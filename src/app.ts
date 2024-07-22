import express from "express";
import connection from "./config/connection";
import apiRoutes from "./routes/index";
import "dotenv/config";
import "./models/associations"; // Importer les associations après les modèles

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use("/api", apiRoutes);

const start = async (): Promise<void> => {
  try {
    await connection.sync();
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
void start();
