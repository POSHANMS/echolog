import * as functions from "firebase-functions/v2/https";
import express, { Request, Response } from "express";
import cors from "cors";
import { createEntry } from "./routes/createEntry";
import { getEntries } from "./routes/getEntries";
import { checkApiKey } from "./middleware/auth";
import { toxicityFilter } from "./middleware/toxicityFilter";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.post("/entries", checkApiKey, toxicityFilter, (req: Request, res: Response) => {
  createEntry(req, res);
});

app.get("/entries", (req: Request, res: Response) => {
  getEntries(req, res);
});

export const api = functions.onRequest(app);