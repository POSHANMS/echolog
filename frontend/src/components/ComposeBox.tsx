import { useState } from "react";
import { motion } from "framer-motion";

const MAX_CHARS = 280;

interface ComposeBoxProps {
  onPost: (text: string) => Promise<void>;
}

export default function ComposeBox({ onPost }: ComposeBoxProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_CHARS - text.length;
  const percentage = text.length / MAX_CHARS;

  const counterColor =
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
    <div
      className="rounded-2xl p-5 mb-8"
      style={{
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-soft)",
        border: "1px solid var(--color-border)"
      }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
        placeholder="What's on your mind?"
        rows={3}
        className="w-full resize-none outline-none text-base leading-relaxed bg-transparent placeholder:opacity-40"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--color-text-primary)"
        }}
      />

      <div className="flex items-center justify-between mt-3">
        <span
          className="text-sm font-medium tabular-nums transition-colors duration-300"
          style={{ color: counterColor }}
        >
          {remaining}
        </span>

        <motion.button
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "var(--color-accent)",
            fontFamily: "var(--font-body)"
          }}
          whileHover={{ backgroundColor: "var(--color-accent-hover)" }}
        >
          {loading ? "Posting…" : "Post"}
        </motion.button>
      </div>

      {error && (
        <p
          className="mt-3 text-sm"
          style={{ color: "var(--color-danger)", fontFamily: "var(--font-body)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}