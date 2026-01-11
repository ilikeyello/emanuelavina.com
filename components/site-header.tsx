"use client";

import { useEffect, useState } from "react";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

const logoSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/payment", label: "Payment Portal" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY < 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-colors duration-300 ${
        isAtTop
          ? "border-transparent bg-transparent"
          : "border-border/60 bg-[#f9f9f7]/85 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <Link href="/" className="group flex flex-col leading-none text-foreground">
          <span
            className={`${logoSerif.className} text-3xl leading-none tracking-tight sm:text-4xl font-semibold`}
          >
            Emanuel
          </span>
          <span className="-mt-1 pl-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/70 group-hover:text-foreground">
            Web Design
          </span>
        </Link>
        <nav className="hidden items-center gap-3 text-sm font-semibold text-foreground/80 md:flex">
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

        <button
          type="button"
          aria-label="Toggle navigation menu"
          className="inline-flex items-center justify-center rounded-full border border-foreground/10 bg-[#f9f9f7]/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80 hover:border-foreground/30 hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/50 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="mr-2">Menu</span>
          <span className="flex flex-col gap-0.5">
            <span className={`h-[2px] w-4 rounded-full bg-foreground transition ${isOpen ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`h-[2px] w-4 rounded-full bg-foreground transition ${isOpen ? "opacity-0" : ""}`} />
            <span className={`h-[2px] w-4 rounded-full bg-foreground transition ${isOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>
      {isOpen && (
        <div className="border-t border-border/60 bg-[#f9f9f7]/95 backdrop-blur md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-3 sm:px-10 lg:px-16">
            <nav className="flex flex-col gap-1 text-sm font-semibold text-foreground/80">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-xl px-3 py-2 transition ${
                      isActive
                        ? "bg-foreground text-background shadow-sm"
                        : "hover:bg-foreground/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
