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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % highlights.length);
    }, 5200);
    return () => clearInterval(id);
  }, [isPaused]);

  return (
    <div 
      className="relative overflow-hidden rounded-2xl border border-border/70 bg-amber-50/70 p-8 shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="min-h-[200px] flex items-center">
        <div className="relative w-full overflow-hidden">
          <div 
            key={index} 
            className="space-y-4 animate-[slideInFromRight_0.8s_ease-out] w-full"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
              {highlights[index].title}
            </p>
            <p className="text-xl leading-7 text-foreground/80">{highlights[index].body}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        {highlights.map((_, i) => (
          <button
            key={i}
            aria-label={`Show highlight ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              i === index ? "bg-amber-700 scale-110" : "bg-foreground/20 hover:bg-foreground/40"
            }`}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-\[slideInFromRight_0\.8s_ease-out\] {
          animation: slideInFromRight 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
