import cors from "cors";
import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes";
import { apiKeyMiddleware } from "./middleware/apikey.middleware";

export const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(
  cors(corsOptions),
  apiKeyMiddleware,
  urlencoded({
    extended: true,
  }),
);

app.use(json());

RegisterRoutes(app);
