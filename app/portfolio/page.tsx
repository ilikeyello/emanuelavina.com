import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | Emanuel Website Design",
  description:
    "Recent Emanuel Website Design church site launches—calm, accessible, ministry-first experiences.",
};

const projects = [
  {
    name: "Northside Community",
    detail: "Multi-campus church with weekly sermon hub and events calendar.",
  },
  {
    name: "Hope Chapel",
    detail: "Prayer-focused site with bold call-to-visit and clear service times.",
  },
  {
    name: "Grace River",
    detail: "Sermon podcast feed, group finder, and streamlined giving.",
  },
];

export default function PortfolioPage() {
  return (
    <div className="bg-[radial-gradient(circle_at_top,_#f9f9f7,_#f3f1ec_45%,_#e6e1d8_80%)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-20 pt-24 sm:px-10 lg:px-16">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
            Portfolio
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl leading-tight text-foreground sm:text-5xl">
            Ministry sites built to welcome and guide.
          </h1>
          <p className="text-lg leading-8 text-foreground/80">
            Each build pairs calm aesthetics with reliable upkeep—so congregations stay
            informed and first-time guests feel invited.
          </p>
        </div>
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.name}
              className="rounded-2xl border border-border/70 bg-white/80 p-6 shadow-sm shadow-amber-100/40 backdrop-blur"
            >
              <h2 className="text-2xl font-[var(--font-playfair)] text-foreground">
                {project.name}
              </h2>
              <p className="mt-2 text-base leading-7 text-foreground/80">{project.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
