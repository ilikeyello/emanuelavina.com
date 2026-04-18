import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import MarketingNav from '@/components/site/MarketingNav';

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
    <div className="min-h-screen bg-[color:var(--background)]">
      <MarketingNav />
      <main className="pb-10 pt-[calc(4rem+env(safe-area-inset-top))] sm:pt-[calc(5rem+env(safe-area-inset-top))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
