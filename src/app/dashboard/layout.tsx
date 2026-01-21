import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <OrganizationSwitcher
                hidePersonal={true}
                afterSelectOrganizationUrl="/dashboard"
                afterCreateOrganizationUrl="/dashboard"
              />
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
