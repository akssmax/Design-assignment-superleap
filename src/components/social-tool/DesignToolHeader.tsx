"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { Logo } from "@/components/Logo";
import { ThemeControls } from "@/components/ThemeControls";

export type DesignToolMode = "social" | "slides";

type Props = {
  mode: DesignToolMode;
  onModeChange: (mode: DesignToolMode) => void;
  children?: React.ReactNode;
};

export function DesignToolHeader({ mode, onModeChange, children }: Props) {
  return (
    <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between border-b border-leap-line bg-surface-primary px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <Link
          href="/"
          aria-label="Back to home"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <Logo href="/" height={24} animation="none" className="text-current" />
        <ToggleButtonGroup
          aria-label="Designer mode"
          selectionMode="single"
          disallowEmptySelection
          size="sm"
          className="social-tool-segment"
          selectedKeys={new Set([mode])}
          onSelectionChange={(keys) => {
            const next = [...keys][0];
            if (next === "social" || next === "slides") onModeChange(next);
          }}
        >
          <ToggleButton id="social" className="px-3 text-xs font-semibold">
            Social
          </ToggleButton>
          <ToggleButtonGroup.Separator />
          <ToggleButton id="slides" className="px-3 text-xs font-semibold">
            Slides
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <ThemeControls compact />
        {children}
      </div>
    </header>
  );
}
