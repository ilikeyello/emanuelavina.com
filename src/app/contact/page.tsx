import MarketingNav from "@/components/site/MarketingNav";
import Footer from "@/components/site/Footer";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata = {
  title: "Contact | Emanuel Web Design",
  description: "Reach Emanuel Avina to plan your church website, content, and client portal onboarding.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <MarketingNav />

      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
          <div className="space-y-4 text-center max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">Contact</p>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">Let’s plan your build.</h1>
            <p className="text-lg text-[color:var(--muted-foreground)] max-w-3xl mx-auto">
              Tell me about your church and the site you need. I’ll reply within one business day with next steps.
            </p>
          </div>

          <div className="max-w-3xl mx-auto rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]/85 p-6 sm:p-8 shadow-sm">
            <ContactForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
