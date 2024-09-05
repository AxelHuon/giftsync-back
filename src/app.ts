import cors from "cors";
import express, { json, urlencoded } from "express";
import { RegisterRoutes } from "../build/routes";
import { apiKeyMiddleware } from "./middleware/apikey.middleware";

export const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(apiKeyMiddleware);
app.use(
  urlencoded({
    extended: true,
  }),
);

app.use(json());

RegisterRoutes(app);
