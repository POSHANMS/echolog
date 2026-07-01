import type { Entry, EntriesResponse, ApiError } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const WRITE_API_KEY = import.meta.env.VITE_WRITE_API_KEY;

export async function fetchEntries(): Promise<Entry[]> {
  const res = await fetch(`${API_BASE_URL}/entries`);
  if (!res.ok) {
    throw new Error("Failed to load entries");
  }
  const data: EntriesResponse = await res.json();
  return data.entries;
}

export async function postEntry(text: string): Promise<Entry> {
  const res = await fetch(`${API_BASE_URL}/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": WRITE_API_KEY
    },
    body: JSON.stringify({ text })
  });

  if (!res.ok) {
    const errBody: ApiError = await res.json();
    throw new Error(errBody.error || "Failed to post entry");
  }

  const created = await res.json();
  return {
    id: created.id,
    text,
    createdAt: new Date().toISOString(),
    flagged: false
  };
}