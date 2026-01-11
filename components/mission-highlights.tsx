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
];

export function MissionHighlights() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % highlights.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-amber-50/70 p-6 shadow-sm">
      <div className="min-h-[170px] space-y-3 transition-all duration-500 ease-out">
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
    </div>
  );
}
