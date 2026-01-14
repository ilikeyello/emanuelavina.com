import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Payment Portal | Emanuel Website Design",
  description: "This page has moved. Please use the Client Portal to manage billing.",
};

export default function PaymentPage() {
  redirect("/dashboard");
  return null;
}
