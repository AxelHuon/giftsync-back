import express, { json, urlencoded } from "express";
import * as fs from "node:fs";
import * as path from "node:path";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import connection from "./config/connection";
import "dotenv/config";
import "./models/associations"; // Importer les associations après les modèles

const app = express();
const port = process.env.PORT || 3001;

app.use(
  urlencoded({
    extended: true,
  }),
);
app.use(json());

const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
RegisterRoutes(app);

app.get("/swagger-json", (req, res) => {
  const swaggerFilePath = path.join(__dirname, "./swagger.json");

  // Lire le fichier JSON
  fs.readFile(swaggerFilePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Erreur lors de la lecture du fichier Swagger JSON");
    } else {
      res.header("Content-Type", "application/json");
      res.send(data);
    }
  });
});

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
