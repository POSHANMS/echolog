import { Request, Response } from "express";
import { db, ENTRIES_COLLECTION } from "../lib/firestore";
import { EntryResponse } from "../types";

export async function getEntries(req: Request, res: Response): Promise<void> {
  try {
    const snapshot = await db
      .collection(ENTRIES_COLLECTION)
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const entries: EntryResponse[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        createdAt: data.createdAt.toDate().toISOString(),
        flagged: data.flagged ?? false
      };
    });

    res.status(200).json({ entries });
  } catch (err) {
    console.error("Failed to fetch entries:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}