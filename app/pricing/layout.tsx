import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Modern Sanctuary Agency",
  description:
    "Simple managed church website packages with professional setup, SEO, and domain connection included.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
