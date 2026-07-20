"use client";

import { HeroMonogramPattern } from "@/components/patterns/HeroMonogramPattern";
import type { PatternId, PostTheme } from "@/lib/social-tool/presets";

type Props = {
  pattern: PatternId;
  theme: PostTheme;
};

export function PostPattern({ pattern, theme }: Props) {
  if (pattern === "none") return null;

  const isDark = theme === "dark";

  if (pattern === "outline") {
    return (
      <div className="social-post-pattern social-post-pattern--outline" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/landing-2/monogram-outline.png"
          alt=""
          className="social-post-outline-img"
        />
      </div>
    );
  }

  const soft = pattern === "monogram-soft";

  return (
    <div className="social-post-pattern" aria-hidden>
      <HeroMonogramPattern
        active={false}
        opacity={soft ? (isDark ? 0.14 : 0.12) : isDark ? 0.28 : 0.22}
        color={isDark ? "#4BB793" : "#275144"}
        className="h-auto w-[min(1800px,165%)] max-w-none"
      />
    </div>
  );
}
