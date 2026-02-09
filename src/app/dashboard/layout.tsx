import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import MarketingNav from '@/components/site/MarketingNav';

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
    <div className="min-h-screen bg-gray-50">
      <MarketingNav />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
