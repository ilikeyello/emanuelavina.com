"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/payment", label: "Payment Portal" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <Link href="/" className="group flex flex-col leading-none text-foreground">
          <span className="font-[var(--font-playfair)] text-3xl leading-none tracking-tight sm:text-4xl">
            Emanuel
          </span>
          <span className="-mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/70 group-hover:text-foreground">
            Web Design
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-foreground/80">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 transition ${
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "hover:bg-foreground/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
