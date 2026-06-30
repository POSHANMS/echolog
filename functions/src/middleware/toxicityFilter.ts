import { Request, Response, NextFunction } from "express";

// Simple keyword-based toxicity check (ML/AI stretch, Option A).
// Not a real classifier -- a deliberately transparent, fast, provably-working
// baseline. Documented limitation: no context awareness, easily bypassed,
// English-only. See DECISION_LOG.md.
const BLOCKED_KEYWORDS = [
  "idiot", "stupid", "hate you", "kill yourself", "trash", "worthless"
];

export function toxicityFilter(req: Request, res: Response, next: NextFunction): void {
  const text: string = (req.body?.text || "").toLowerCase();

  const matched = BLOCKED_KEYWORDS.find((word) => text.includes(word));

  if (matched) {
    res.status(422).json({
      error: "Entry rejected: content flagged by toxicity filter",
      matchedTerm: matched
    });
    return;
  }

  next();
}