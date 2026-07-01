import express, { Request, Response } from "express";
import cors from "cors";
import { createEntry } from "./routes/createEntry";
import { getEntries } from "./routes/getEntries";
import { checkApiKey } from "./middleware/auth";
import { toxicityFilter } from "./middleware/toxicityFilter";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.post("/entries", checkApiKey, toxicityFilter, (req: Request, res: Response) => {
  createEntry(req, res);
});

app.get("/entries", (req: Request, res: Response) => {
  getEntries(req, res);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`EchoLog API running on port ${PORT}`);
});

export default app;