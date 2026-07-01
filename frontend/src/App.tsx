import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import Header from "./components/Header";
import ComposeBox from "./components/ComposeBox";
import Feed from "./components/Feed";
import { fetchEntries, postEntry } from "./api/client";
import type { Entry } from "./types";

const POLL_INTERVAL = 30000;

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cursor follower
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springX = useSpring(cursorX, { stiffness: 80, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 200);
      cursorY.set(e.clientY - 200);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

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
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--color-bg)" }}>

      {/* Global cursor glow orb */}
      <motion.div
        className="pointer-events-none fixed z-50"
        style={{
          x: springX,
          y: springY,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(193,98,61,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Floating background blobs */}
      <div
        className="pointer-events-none fixed top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(193,98,61,0.15) 0%, transparent 70%)",
          filter: "blur(40px)"
        }}
      />
      <div
        className="pointer-events-none fixed bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(217,140,61,0.2) 0%, transparent 70%)",
          filter: "blur(60px)"
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Header />
      </motion.div>

      <main className="max-w-2xl mx-auto px-6 py-8 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <ComposeBox onPost={handlePost} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Feed entries={entries} loading={loading} error={error} />
        </motion.div>
      </main>
    </div>
  );
}