import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes";
import { apiKeyMiddleware } from "./middleware/apikey.middleware";

export const app = express();

app.use(
  apiKeyMiddleware,
  urlencoded({
    extended: true,
  }),
);
app.use(json());

RegisterRoutes(app);
