import { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
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

  // Cursor
  const cursorX = useMotionValue(-400);
  const cursorY = useMotionValue(-400);
  const springX = useSpring(cursorX, { stiffness: 60, damping: 18 });
  const springY = useSpring(cursorY, { stiffness: 60, damping: 18 });

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 300);
      cursorY.set(e.clientY - 300);
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
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "var(--color-bg)" }}>

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, var(--color-accent), var(--color-warning))"
        }}
      />

      {/* Cursor orb — bigger and more visible */}
      <motion.div
        className="pointer-events-none fixed z-40"
        style={{
          x: springX,
          y: springY,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(193,98,61,0.10) 0%, rgba(193,98,61,0.03) 40%, transparent 70%)",
        }}
      />

      {/* Static background blobs */}
      <div className="pointer-events-none fixed top-[-150px] right-[-150px] w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(193,98,61,0.12) 0%, transparent 70%)",
          filter: "blur(60px)"
        }}
      />
      <div className="pointer-events-none fixed bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(217,140,61,0.15) 0%, transparent 70%)",
          filter: "blur(80px)"
        }}
      />

      {/* Page entrance */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Header />
      </motion.div>

      <main className="max-w-2xl mx-auto px-6 py-8 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <ComposeBox onPost={handlePost} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Feed entries={entries} loading={loading} error={error} />
        </motion.div>
      </main>
    </div>
  );
}