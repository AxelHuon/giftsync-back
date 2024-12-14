import express, { json, urlencoded } from "express";
import rateLimit from "express-rate-limit";
import { RegisterRoutes } from "../build/routes";
import { apiKeyMiddleware } from "./middleware/apikey.middleware";

const cors = require("cors");

export const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message:
    "Trop de requêtes effectuées depuis cette IP, veuillez réessayer après 15 minutes.",
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

app.use(cors());
app.use("/api", apiKeyMiddleware, apiLimiter);
app.use(
  urlencoded({
    extended: true,
  }),
);

app.use(json());

RegisterRoutes(app);
