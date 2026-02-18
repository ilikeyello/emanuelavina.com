import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Church } from 'lucide-react';

export default function DashboardNav() {
  return (
    <header className="bg-[color:var(--background)] border-b border-[color:var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-[color:var(--foreground)] hover:text-[color:var(--primary)] transition">
              <Church className="w-6 h-6" />
              <span className="font-serif font-semibold text-lg">Emanuel</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/client-portal" className="text-sm font-semibold text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)] transition">
              Client Portal
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </header>
  );
}
