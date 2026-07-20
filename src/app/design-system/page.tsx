import type { Metadata } from "next";
import { DesignSystemPage } from "@/components/DesignSystemPage";

export const metadata: Metadata = {
  title: "Design system — Superleap colors",
  description:
    "Superleap brand, neutral, and violet color scales in OKLCH — 12-step Tailwind tokens.",
};

export default function Page() {
  return <DesignSystemPage />;
}
