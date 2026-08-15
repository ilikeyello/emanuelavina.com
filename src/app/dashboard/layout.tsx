import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import MarketingNav from '@/components/site/MarketingNav';
import Footer from '@/components/site/Footer';

// Force dynamic rendering for dashboard routes
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      redirect('/sign-in');
    }
  } catch (error) {
    console.error('Authentication check failed in dashboard layout:', error);
    // Optionally, you could redirect to an error page or show a fallback UI
    redirect('/sign-in');
  }

  return (
    // Same shell as every marketing page: nav, flex-1 main, footer. This is
    // what makes the portal read as part of the same site.
    <div className="min-h-screen flex flex-col bg-[color:var(--background)] text-[color:var(--foreground)]">
      <MarketingNav />
      {/* The nav is sticky (not fixed), so no spacer is needed — it occupies
          normal flow just like it does on the marketing pages. */}
      <main className="flex-1 pt-6 pb-12 sm:pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
