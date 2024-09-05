import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes";
import { apiKeyMiddleware } from "./middleware/apikey.middleware";

const cors = require("cors");

export const app = express();

app.use(cors());
app.use(apiKeyMiddleware);
app.use(
  urlencoded({
    extended: true,
  }),
);

app.use(json());

RegisterRoutes(app);
