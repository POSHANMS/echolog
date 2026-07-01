import { motion, useInView } from "framer-motion";
import { useRef } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -32, scale: 0.97 }}
      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{
        y: -5,
        scale: 1.01,
        boxShadow: "0 12px 32px rgba(193, 98, 61, 0.18)"
      }}
      className="rounded-2xl p-5 cursor-default relative overflow-hidden"
      style={{
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-soft)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Subtle left accent bar */}
      <motion.div
        className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
        style={{ background: "var(--color-accent)" }}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ delay: 0.15, duration: 0.4, ease: "easeOut" }}
      />

      <div className="pl-3">
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
      </div>
    </motion.div>
  );
}