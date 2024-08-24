import { NextFunction, Request, Response } from "express";

export function apiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res
      .status(401)
      .json({ message: "API key missing", code: "api_key_is_mandatory" });
  }
  const validApiKey = process.env.API_KEY;
  if (apiKey !== validApiKey) {
    return res.status(403).json({ message: "Invalid API key" });
  }

  next();
}
