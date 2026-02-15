import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import DashboardNav from '@/components/dashboard/DashboardNav';

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
      <DashboardNav />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
