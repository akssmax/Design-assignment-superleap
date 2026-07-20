import { Globe, Link2, Mail, Megaphone, Share2, Newspaper } from "lucide-react";
import { chipClass } from "./skeletons";
import { sourceTone, type LeadSource } from "@/lib/dashboard/types";

const sourceIcon: Record<LeadSource, typeof Megaphone> = {
  "Google Ads": Megaphone,
  LinkedIn: Link2,
  "Facebook Ads": Globe,
  "Email Marketing": Mail,
  "Affiliate Marketing": Share2,
  "Content Marketing": Newspaper,
};

export function SourceChip({ source }: { source: LeadSource }) {
  const Icon = sourceIcon[source];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${chipClass(sourceTone[source])}`}
    >
      <Icon className="size-3 shrink-0 opacity-80" aria-hidden />
      {source}
    </span>
  );
}
