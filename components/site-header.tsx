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
  { href: "/pricing", label: "Packages" },
  { href: "/contact", label: "Contact" },
  { href: "/payment", label: "Payment Portal" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!isHomePage) return;
    
    const handleScroll = () => setIsAtTop(window.scrollY < 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Always show solid navbar on non-home pages
  const shouldShowTransparent = isHomePage && isAtTop;

  return (
    <header
      className={`fixed top-0 z-30 w-full border-b transition-colors duration-300 ${
        shouldShowTransparent
          ? "border-transparent bg-transparent"
          : "border-border/60 bg-[#f9f9f7]/85 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <Link
          href="/"
          className={`group flex flex-col leading-none ${shouldShowTransparent ? "text-white" : "text-foreground"}`}
        >
          <span
            className={`${logoSerif.className} text-3xl leading-none tracking-tight sm:text-4xl font-semibold`}
          >
            Emanuel
          </span>
          <span
            className={`-mt-1 pl-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
              shouldShowTransparent ? "text-white/70 group-hover:text-white" : "text-foreground/70 group-hover:text-foreground"
            }`}
          >
            Web Design
          </span>
        </Link>
        <nav className="hidden items-center gap-3 text-sm font-semibold md:flex">
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
                    : shouldShowTransparent
                      ? "text-white/90 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                      : "text-foreground/80 hover:bg-foreground/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/50"
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
          className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] md:hidden ${
            shouldShowTransparent
              ? "border border-white/40 bg-white/10 text-white hover:border-white/60 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              : "border border-foreground/10 bg-[#f9f9f7]/90 text-foreground/80 hover:border-foreground/30 hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/50"
          }`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="mr-2">Menu</span>
          <span className="flex flex-col gap-0.5">
            <span
              className={`h-[2px] w-4 rounded-full transition ${
                shouldShowTransparent ? "bg-white" : "bg-foreground"
              } ${isOpen ? "translate-y-[3px] rotate-45" : ""}`}
            />
            <span
              className={`h-[2px] w-4 rounded-full transition ${
                shouldShowTransparent ? "bg-white" : "bg-foreground"
              } ${isOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`h-[2px] w-4 rounded-full transition ${
                shouldShowTransparent ? "bg-white" : "bg-foreground"
              } ${isOpen ? "-translate-y-[3px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-50 bg-black/20 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          {/* Slide-out menu */}
          <div className="fixed right-0 top-0 z-[60] h-full w-4/5 max-w-sm border-l border-border/60 bg-[#f9f9f7] shadow-xl md:hidden transform transition-transform duration-300 ease-out" style={{ backgroundColor: '#F9F9F7' }}>
            <div className="flex h-full flex-col px-6 py-6 bg-[#f9f9f7]" style={{ backgroundColor: '#F9F9F7' }}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col leading-none">
                  <span
                    className={`${logoSerif.className} text-2xl leading-none tracking-tight font-semibold text-foreground`}
                  >
                    Emanuel
                  </span>
                  <span className="-mt-1 pl-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/70">
                    Web Design
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Close navigation menu"
                  className="rounded-full p-2 text-foreground/80 hover:bg-foreground/10 transition"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-col gap-2 text-base font-semibold text-foreground/80">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`rounded-xl px-4 py-3 transition ${
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
        </>
      )}
    </header>
  );
}
