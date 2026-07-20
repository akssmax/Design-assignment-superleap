import { chipClass } from "./skeletons";
import { interestTone, type LeadInterest } from "@/lib/dashboard/types";

export function InterestChip({ interest }: { interest: LeadInterest }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${chipClass(interestTone[interest])}`}
    >
      {interest}
    </span>
  );
}
