import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import ComposeBox from "./components/ComposeBox";
import Feed from "./components/Feed";
import { fetchEntries, postEntry } from "./api/client";
import { Entry } from "./types";

const POLL_INTERVAL = 30000; // 30 seconds

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    try {
      const data = await fetchEntries();
      setEntries(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries();
    const interval = setInterval(loadEntries, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadEntries]);

  async function handlePost(text: string) {
    const newEntry = await postEntry(text);
    setEntries((prev) => [newEntry, ...prev.slice(0, 19)]);
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-8 md:px-12">
        <ComposeBox onPost={handlePost} />
        <Feed entries={entries} loading={loading} error={error} />
      </main>
    </div>
  );
}