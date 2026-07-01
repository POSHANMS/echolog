import { motion } from "framer-motion";
import type { Entry } from "../types";

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface EntryCardProps {
  entry: Entry;
}

export default function EntryCard({ entry }: EntryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      whileHover={{
        y: -3,
        boxShadow: "0 8px 24px rgba(193, 98, 61, 0.14)"
      }}
      className="rounded-2xl p-5 cursor-default"
      style={{
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-soft)",
        border: "1px solid var(--color-border)",
        transition: "box-shadow 0.2s ease"
      }}
    >
      <p
        className="text-base leading-relaxed"
        style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}
      >
        {entry.text}
      </p>
      <p
        className="mt-3 text-xs"
        style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
      >
        {timeAgo(entry.createdAt)}
      </p>
    </motion.div>
  );
}