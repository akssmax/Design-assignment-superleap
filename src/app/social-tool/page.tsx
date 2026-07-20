import type { Metadata } from "next";
import { SocialToolPage } from "@/components/social-tool/SocialToolPage";

export const metadata: Metadata = {
  title: "Social Post Designer — Superleap",
  description:
    "Design branded LinkedIn and social posts from Superleap templates. Export PNG, JPG, or PDF.",
};

export default function SocialToolRoute() {
  return <SocialToolPage />;
}
