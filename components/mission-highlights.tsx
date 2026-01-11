"use client";

import { useEffect, useState } from "react";

const highlights = [
  {
    title: "Digital Generosity",
    body: "Clear, trustworthy giving paths that make it simple to support the mission from anywhere.",
  },
  {
    title: "The Living Word",
    body: "Sermons and teaching organized, searchable, and easy to revisit throughout the week.",
  },
  {
    title: "Your Church, Anywhere",
    body: "A calm, mobile-first experience so your community can stay connected on every device.",
  },
  {
    title: "Ministry rhythm",
    body:
      "Weekly updates, sermon posting, and event refreshes—handled so your team can focus on people, not pixels. Clear accessibility, peaceful visuals, and mobile-first layouts make every interaction feel like a warm welcome.",
  },
];

export function MissionHighlights() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % highlights.length);
    }, 5200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-amber-50/70 p-6 shadow-sm">
      <div key={index} className="min-h-[190px] space-y-3 animate-[fadeSlide_0.6s_ease-out]">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
          {highlights[index].title}
        </p>
        <p className="text-base leading-7 text-foreground/80">{highlights[index].body}</p>
      </div>
      <div className="mt-4 flex gap-2">
        {highlights.map((_, i) => (
          <button
            key={i}
            aria-label={`Show highlight ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index ? "bg-amber-700" : "bg-foreground/20 hover:bg-foreground/40"
            }`}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
