import { Request, Response } from "express";
import { db, ENTRIES_COLLECTION } from "../lib/firestore";
import { Timestamp } from "firebase-admin/firestore";

export async function createEntry(req: Request, res: Response): Promise<void> {
  const text = req.body?.text;

  if (typeof text !== "string" || text.trim().length === 0) {
    res.status(400).json({ error: "Field 'text' must be a non-empty string" });
    return;
  }

  if (text.length > 280) {
    res.status(400).json({ error: "Field 'text' must be 280 characters or fewer" });
    return;
  }

  try {
    const docRef = await db.collection(ENTRIES_COLLECTION).add({
      text: text.trim(),
      createdAt: Timestamp.now()
    });

    res.status(201).json({ id: docRef.id, message: "Entry created" });
  } catch (err) {
    console.error("Failed to create entry:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}