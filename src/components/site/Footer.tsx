import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[color:var(--border)] bg-[color:var(--background)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-[color:var(--muted-foreground)]">&copy; {new Date().getFullYear()} Emanuel Avina. All rights reserved.</p>
          <p className="text-sm text-[color:var(--muted-foreground)]">Emanuel Web Design, open your doors to the world.</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-[color:var(--muted-foreground)]">
          <Link href="/contact" className="hover:text-[color:var(--foreground)] transition-colors">Contact</Link>
          <Link href="/dashboard/client-portal" className="hover:text-[color:var(--foreground)] transition-colors">Client Portal</Link>
        </div>
      </div>
    </footer>
  );
}
