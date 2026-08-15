"use client";

import { SignedIn, UserButton, OrganizationSwitcher } from "@clerk/nextjs";
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
  const isHomePage = pathname === "/";
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const globeSrc = isLogoHovered ? "/logo/globehover.png" : "/logo/globe.png";
  const nameSrc = isLogoHovered ? "/logo/namehover.png" : "/logo/name.png";
  const useCompactLogo = isScrolled || open;

  // Only the homepage has a hero the bar can float over. Every other page
  // (marketing or portal) gets the solid treatment immediately so the bar
  // never sits invisibly on top of page content.
  const isTransparent = isHomePage && !isScrolled && !open;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent the page behind the mobile menu from scrolling while it is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isLinkActive = (href: string) =>
    pathname === href ||
    (href === "/dashboard/client-portal" && Boolean(pathname?.startsWith("/dashboard")));

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
        isTransparent
          ? "border-b border-transparent bg-transparent"
          : "border-b border-[color:var(--border)] bg-[color:var(--background)] shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-16 sm:h-20">
        <Link
          href="/"
          className="flex items-center leading-none min-w-0 shrink"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
        >
          <div className="flex items-center gap-1 sm:gap-2 translate-y-[3px] min-w-0">
            <Image
              src={globeSrc}
              alt="Emanuel Web Design globe icon"
              width={56}
              height={56}
              priority
              className={`w-auto shrink-0 transition-all duration-300 ${
                useCompactLogo ? "h-8 sm:h-9 md:h-10" : "h-9 sm:h-11 md:h-12"
              }`}
            />
            <Image
              src={nameSrc}
              alt="Emanuel Web Design name"
              width={480}
              height={134}
              priority
              className={`w-auto max-w-full transition-all duration-300 ${
                useCompactLogo
                  ? "h-[1.7rem] sm:h-[2.15rem] md:h-[2.35rem]"
                  : "h-[2rem] sm:h-[2.7rem] md:h-[2.95rem]"
              }`}
            />
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <nav className="flex items-center gap-6 lg:gap-8 text-[color:var(--muted-foreground)]">
            {links.map((link) => {
              const isActive = isLinkActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? isTransparent
                        ? "text-white"
                        : "text-[#6f8192]"
                      : "hover:text-[color:var(--foreground)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <SignedIn>
            <div className="flex items-center gap-3 lg:gap-4 pl-4 border-l border-[color:var(--border)]">
              <OrganizationSwitcher
                afterCreateOrganizationUrl="/dashboard/client-portal"
                appearance={{
                  elements: {
                    organizationSwitcherTrigger:
                      "text-[color:var(--foreground)] font-medium",
                  },
                }}
              />
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>

        <div className="md:hidden flex items-center gap-2 shrink-0">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="inline-flex items-center justify-center h-10 w-10 rounded-md text-[color:var(--foreground)] hover:bg-[color:var(--muted)]/60"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="flex flex-col">
            {links.map((link) => {
              const isActive = isLinkActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block w-full rounded-md px-2 py-3 text-base font-medium ${
                    isActive
                      ? "bg-[color:var(--muted)]/60 text-[#6f8192]"
                      : "text-[color:var(--foreground)]"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <SignedIn>
            <div className="mt-3 pt-3 border-t border-[color:var(--border)]">
              <OrganizationSwitcher
                afterCreateOrganizationUrl="/dashboard/client-portal"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    organizationSwitcherTrigger:
                      "w-full justify-start text-[color:var(--foreground)] font-medium",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      )}
    </header>
  );
}
