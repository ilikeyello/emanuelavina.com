"use client";

import Image from "next/image";
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
  const isHomePage = pathname === '/';
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const globeSrc = isLogoHovered ? '/logo/globehover.png' : '/logo/globe.png';
  const nameSrc = isLogoHovered ? '/logo/namehover.png' : '/logo/name.png';
  const useCompactLogo = isScrolled || open;

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
      className={`w-full sticky top-0 z-50 transition-colors duration-300 ${
        isScrolled || open
          ? "border-b border-[color:var(--border)] bg-[color:var(--background)]/95 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-18">
        <Link
          href="/"
          className="flex items-center leading-none"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <div className="flex items-center gap-1 sm:gap-2 translate-y-[6px]">
            <Image
              src={globeSrc}
              alt="Emanuel Web Design globe icon"
              width={56}
              height={56}
              priority
              className={`w-auto transition-all duration-300 ${useCompactLogo ? 'h-8 sm:h-9 md:h-10' : 'h-10 sm:h-11 md:h-12'}`}
            />
            <Image
              src={nameSrc}
              alt="Emanuel Web Design name"
              width={480}
              height={134}
              priority
              className={`w-auto transition-all duration-300 ${useCompactLogo ? 'h-[1.95rem] sm:h-[2.15rem] md:h-[2.35rem]' : 'h-[2.45rem] sm:h-[2.7rem] md:h-[2.95rem]'}`}
            />
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
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive 
                    ? (isHomePage && !isScrolled ? 'text-white' : 'text-[#6f8192]')
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
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block w-full text-sm font-medium py-2 ${
                  isActive 
                    ? 'text-[#6f8192]' 
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
