import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Modern Sanctuary Agency",
  description:
    "Schedule a calm, ministry-first web consult. We’ll align your site to serve visitors and members every week.",
};

export default function ContactPage() {
  return (
    <div className="bg-[radial-gradient(circle_at_top,_#f9f9f7,_#f3f1ec_45%,_#e6e1d8_80%)]">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 pb-20 pt-24 sm:px-10 lg:px-16">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-700">
            Contact
          </p>
          <h1 className="font-[var(--font-playfair)] text-4xl leading-tight text-foreground sm:text-5xl">
            Let’s plan your digital front door.
          </h1>
          <p className="text-lg leading-8 text-foreground/80">
            Tell us about your church, timeline, and goals. We’ll recommend the simplest,
            most reliable path to launch or refresh.
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-white/85 p-8 shadow-lg shadow-amber-100/40 backdrop-blur">
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/80">
                Name
                <input
                  type="text"
                  className="rounded-lg border border-border/70 bg-white px-3 py-3 text-base text-foreground outline-none transition focus:border-foreground/60 focus:ring-2 focus:ring-foreground/20"
                  placeholder="Your name"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/80">
                Email
                <input
                  type="email"
                  className="rounded-lg border border-border/70 bg-white px-3 py-3 text-base text-foreground outline-none transition focus:border-foreground/60 focus:ring-2 focus:ring-foreground/20"
                  placeholder="you@example.com"
                  required
                />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/80">
              Church name
              <input
                type="text"
                className="rounded-lg border border-border/70 bg-white px-3 py-3 text-base text-foreground outline-none transition focus:border-foreground/60 focus:ring-2 focus:ring-foreground/20"
                placeholder="Church / ministry name"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-foreground/80">
              What do you need?
              <textarea
                className="min-h-[140px] rounded-lg border border-border/70 bg-white px-3 py-3 text-base text-foreground outline-none transition focus:border-foreground/60 focus:ring-2 focus:ring-foreground/20"
                placeholder="Website goals, timeline, current pain points"
                required
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-foreground px-6 py-3 text-base font-semibold text-background transition hover:bg-foreground/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
