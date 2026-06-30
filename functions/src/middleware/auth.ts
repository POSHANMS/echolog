import { Request, Response, NextFunction } from "express";

export function checkApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.header("x-api-key");
  const expectedKey = process.env.WRITE_API_KEY;

  if (!expectedKey) {
    res.status(500).json({ error: "Server misconfigured: API key not set" });
    return;
  }

  if (!apiKey || apiKey !== expectedKey) {
    res.status(401).json({ error: "Unauthorized: invalid or missing API key" });
    return;
  }

  next();
}