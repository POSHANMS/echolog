import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_CHARS = 280;
const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ComposeBoxProps {
  onPost: (text: string) => Promise<void>;
}

export default function ComposeBox({ onPost }: ComposeBoxProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const remaining = MAX_CHARS - text.length;
  const percentage = text.length / MAX_CHARS;
  const strokeDashoffset = CIRCUMFERENCE * (1 - percentage);

  const arcColor =
    percentage < 0.8
      ? "var(--color-accent)"
      : percentage < 0.95
      ? "var(--color-warning)"
      : "var(--color-danger)";

  const counterTextColor =
    percentage < 0.8
      ? "var(--color-text-secondary)"
      : percentage < 0.95
      ? "var(--color-warning)"
      : "var(--color-danger)";

  async function handleSubmit() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      await onPost(text.trim());
      setText("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      animate={{
        boxShadow: focused
          ? "0 0 0 2px rgba(193,98,61,0.3), 0 8px 32px rgba(193,98,61,0.12)"
          : "var(--shadow-soft)"
      }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl p-5 mb-8"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)"
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="What's on your mind?"
        rows={3}
        className="w-full resize-none outline-none text-base leading-relaxed bg-transparent placeholder:opacity-40"
        style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}
      />

      <div className="flex items-center justify-between mt-3">
        {/* SVG arc progress ring + number */}
        <div className="flex items-center gap-2">
          <svg width="40" height="40" className="-rotate-90">
            <circle
              cx="20" cy="20" r={RADIUS}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="3"
            />
            <motion.circle
              cx="20" cy="20" r={RADIUS}
              fill="none"
              stroke={arcColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.2 }}
            />
          </svg>
          <motion.span
            className="text-sm font-medium tabular-nums"
            animate={{ color: counterTextColor }}
            transition={{ duration: 0.3 }}
          >
            {remaining}
          </motion.span>
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.03 }}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden"
          style={{ background: "var(--color-accent)", fontFamily: "var(--font-body)" }}
        >
          <motion.span
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
          <span className="relative z-10">{loading ? "Posting…" : "Post"}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-sm"
            style={{ color: "var(--color-danger)", fontFamily: "var(--font-body)" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}