import { AnimatePresence, motion } from "framer-motion";
import type { Entry } from "../types";
import EntryCard from "./EntryCard";

interface FeedProps {
  entries: Entry[];
  loading: boolean;
  error: string | null;
}

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-2xl p-5 overflow-hidden relative"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)"
      }}
    >
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="h-4 rounded-full w-3/4 mb-3" style={{ background: "var(--color-accent-soft)" }} />
        <div className="h-4 rounded-full w-1/2 mb-3" style={{ background: "var(--color-accent-soft)" }} />
        <div className="h-3 rounded-full w-16 mt-4" style={{ background: "var(--color-accent-soft)", opacity: 0.6 }} />
      </motion.div>
    </motion.div>
  );
}

export default function Feed({ entries, loading, error }: FeedProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonCard key={i} delay={i * 0.08} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl p-6 text-center"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <p className="text-base" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
          Couldn't load entries right now.
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)", opacity: 0.7, fontFamily: "var(--font-body)" }}>
          {error}
        </p>
      </motion.div>
    );
  }

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl p-10 text-center"
        style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <p className="text-2xl mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}>
          Nothing here yet.
        </p>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
          Be the first to leave a thought.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence initial={false}>
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 28,
              delay: i * 0.06
            }}
          >
            <EntryCard entry={entry} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}