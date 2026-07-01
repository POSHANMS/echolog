import { AnimatePresence, motion } from "framer-motion";
import type { Entry } from "../types";
import EntryCard from "./EntryCard";

interface FeedProps {
  entries: Entry[];
  loading: boolean;
  error: string | null;
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 overflow-hidden relative"
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)"
      }}
    >
      <div
        className="h-4 rounded-full w-3/4 mb-3"
        style={{ background: "var(--color-accent-soft)" }}
      />
      <div
        className="h-4 rounded-full w-1/2 mb-3"
        style={{ background: "var(--color-accent-soft)" }}
      />
      <div
        className="h-3 rounded-full w-16 mt-4"
        style={{ background: "var(--color-accent-soft)", opacity: 0.6 }}
      />
    </div>
  );
}

export default function Feed({ entries, loading, error }: FeedProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)"
        }}
      >
        <p
          className="text-base"
          style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
        >
          Couldn't load entries right now.
        </p>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text-secondary)", opacity: 0.7, fontFamily: "var(--font-body)" }}
        >
          {error}
        </p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)"
        }}
      >
        <p
          className="text-2xl mb-2"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
        >
          Nothing here yet.
        </p>
        <p
          className="text-sm"
          style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
        >
          Be the first to leave a thought.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence initial={false}>
        {entries.map((entry) => (
          <motion.div key={entry.id}>
            <EntryCard entry={entry} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}