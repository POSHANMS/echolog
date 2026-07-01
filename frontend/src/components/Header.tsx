import { useEffect, useRef } from "react";

export default function Header() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      const rect = glowRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glowRef.current.style.setProperty("--glow-x", `${x}px`);
      glowRef.current.style.setProperty("--glow-y", `${y}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <header
      ref={glowRef}
      className="relative overflow-hidden border-b border-border px-6 py-8 md:px-12 md:py-10"
      style={{
        background: `radial-gradient(circle 400px at var(--glow-x, 50%) var(--glow-y, 50%), rgba(193,98,61,0.07), transparent 70%), var(--color-bg)`
      }}
    >
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
        >
          EchoLog
        </h1>
        <p
          className="mt-2 text-base md:text-lg"
          style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}
        >
          A quiet place to leave a thought.
        </p>
      </div>
    </header>
  );
}