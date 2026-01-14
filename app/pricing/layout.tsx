import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packages | Emanuel Website Design",
  description:
    "Simple managed church website packages by Emanuel Website Design with professional setup, SEO, and domain connection included.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
