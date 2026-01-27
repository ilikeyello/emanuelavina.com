import Link from "next/link";
import MarketingNav from "@/components/site/MarketingNav";
import Footer from "@/components/site/Footer";

export const metadata = {
  title: "Contact | Emanuel Web Design",
  description: "Reach Emanuel Avina to plan your church website, content, and client portal onboarding.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <MarketingNav />

      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">Contact</p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold leading-tight">Let’s plan your build.</h1>
            <p className="text-lg text-[color:var(--muted-foreground)] max-w-3xl mx-auto">
              Tell me about your church and the site you need. I’ll reply within one business day with next steps.
            </p>
          </div>

          <div className="max-w-3xl mx-auto rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/85 p-6 sm:p-8 shadow-sm">
            <form className="space-y-6" method="post" action="#">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-semibold text-[color:var(--foreground)]">
                  Full name
                  <input
                    type="text"
                    name="name"
                    required
                    className="rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                    placeholder="Full name"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[color:var(--foreground)]">
                  Email
                  <input
                    type="email"
                    name="email"
                    required
                    className="rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[color:var(--foreground)]">
                Church name & location
                <input
                  type="text"
                  name="church"
                  className="rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                  placeholder="Church name – City, State"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-semibold text-[color:var(--foreground)]">
                Project goals / message
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-[color:var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]"
                  placeholder="Share your goals: visitors, giving, livestreams, events, timelines, and any current site."
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] text-base font-semibold shadow-[0_14px_32px_rgba(0,0,0,0.3)] ring-1 ring-[color:var(--primary)]/65 transition hover:bg-[color:var(--primary)]/90 hover:shadow-[0_16px_34px_rgba(0,0,0,0.32)]"
                >
                  Send message
                </button>
                <Link
                  href="mailto:contact@emanuelavina.com"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[color:var(--foreground)]/80 text-base font-semibold text-[color:var(--foreground)] bg-[color:var(--background)]/65 backdrop-blur-md shadow-[0_10px_22px_rgba(0,0,0,0.2)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.24)]"
                >
                  Email instead
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
