import express, { Request as ExRequest, Response as ExResponse } from "express";
import * as fs from "node:fs";
import * as path from "node:path";
import process from "node:process";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";
import { app } from "./app";
import connection from "./config/connection";
import "dotenv/config";
import "./models/associations";

require("dotenv").config();
const port = process.env.PORT;
app.use(
  "/api-docs",
  swaggerUi.serve,
  async (_req: ExRequest, res: ExResponse) => {
    return res.send(
      swaggerUi.generateHTML(await import("../build/swagger.json")),
    );
  },
);

app.get("/swagger-json", (req, res) => {
  const swaggerFilePath = path.join(__dirname, "../swagger.json");
  fs.readFile(swaggerFilePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Erreur lors de la lecture du fichier Swagger JSON");
    } else {
      res.header("Content-Type", "application/json");
      res.send(data);
    }
  });
});

app.use(function errorHandler(
  err: unknown,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): express.Response | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  // ... gestion d'autres types d'erreurs
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const start = async (): Promise<void> => {
  try {
    await connection.sync();
    app.listen(port, () => {
      console.log(`app started on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
void start();
