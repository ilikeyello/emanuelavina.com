import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Modern Sanctuary Agency",
  description:
    "Meet the Modern Sanctuary team—web designers focused on helping churches stay ministry-first while we handle technology.",
};

export default function AboutPage() {
  return (
    <div className="bg-[radial-gradient(circle_at_top,_#f9f9f7,_#f3f1ec_45%,_#e6e1d8_80%)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-20 pt-24 sm:px-10 lg:px-16">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
            About
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl leading-tight text-foreground sm:text-5xl">
            A peaceful, ministry-first web partner.
          </h1>
          <p className="text-lg leading-8 text-foreground/80">
            We build serene, accessible digital spaces so your church can focus on people,
            not plugins. Every decision—contrast, typography, structure—is tuned for
            clarity, warmth, and trust.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              title: "Ministry rhythm aware",
              body: "We operate on weekly cadences that align with your services, events, and sermon uploads.",
            },
            {
              title: "Accessibility first",
              body: "WCAG 2.1 minded: large type, strong contrast, clear ARIA labels, and mobile-first flows.",
            },
            {
              title: "Reliability over flash",
              body: "Stable hosting, backups, and safe integrations so your site is ready for Sunday—every Sunday.",
            },
            {
              title: "Pastoral empathy",
              body: "We listen to your story and translate it into a calm, welcoming online presence.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/70 bg-white/80 p-6 shadow-sm shadow-amber-100/40 backdrop-blur"
            >
              <h2 className="font-semibold text-foreground">{item.title}</h2>
              <p className="mt-2 text-base leading-7 text-foreground/80">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
