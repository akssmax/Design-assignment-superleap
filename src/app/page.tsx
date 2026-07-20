import type { Metadata } from "next";
import { Landing2Page } from "@/components/landing-2/Landing2Page";

export const metadata: Metadata = {
  title: "Superleap — Your Sales Team Just Got an AI Teammate",
  description:
    "Enterprise-grade AI CRM for modern sales teams — natively intelligent, flexible by design, and fast to implement.",
};

export default function Home() {
  return <Landing2Page />;
}
