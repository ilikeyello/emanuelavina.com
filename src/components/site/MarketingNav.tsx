"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard/client-portal", label: "Client Portal" },
];

export default function MarketingNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isDashboardPage = pathname?.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full sticky top-0 z-40 transition-colors duration-300 ${
        isScrolled || open
          ? "border-b border-[color:var(--border)] bg-[color:var(--background)]/95 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center leading-none">
          <div className="flex flex-col">
            <span className="text-[26px] font-bold font-serif tracking-[0.02em] text-[color:var(--foreground)]">
              Emanuel
            </span>
            <span className="text-[13px] font-semibold font-sans tracking-[0.08em] text-[color:var(--muted-foreground)] uppercase">
              Web Design
            </span>
          </div>
          {isDashboardPage && (
            <>
              <div className="mx-4 h-8 w-px bg-[color:var(--border)]"></div>
              <span className="text-xl font-semibold text-[color:var(--foreground)]">
                Admin Dashboard
              </span>
            </>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[color:var(--muted-foreground)]">
          {links.map((link) => {
            const isActive = pathname === link.href || 
                           (link.href === '/dashboard/client-portal' && pathname?.startsWith('/dashboard/client-portal'));
            const isHomePage = pathname === '/';
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive 
                    ? (isHomePage && !isScrolled ? 'text-white' : 'text-[color:var(--accent)]')
                    : 'hover:text-[color:var(--foreground)]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label="Toggle navigation"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[color:var(--foreground)] hover:bg-[color:var(--muted)]/60"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href || 
                           (link.href === '/dashboard/client-portal' && pathname?.startsWith('/dashboard/client-portal'));
            const isHomePage = pathname === '/';
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block w-full text-sm font-medium py-2 ${
                  isActive 
                    ? (isHomePage && !isScrolled ? 'text-white' : 'text-[color:var(--accent)]')
                    : 'text-[color:var(--foreground)]'
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
