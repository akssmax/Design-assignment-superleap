"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Sidebar } from "./Sidebar";
import { LeadsTable } from "./LeadsTable";

type Props = {
  /** Full viewport app shell, or fill a parent frame (hero preview). */
  className?: string;
};

export function DashboardShell({ className = "h-svh" }: Props) {
  const [navOpen, setNavOpen] = useState(false);

  // Close drawer on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setNavOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      data-theme="light"
      className={`relative flex overflow-hidden bg-neutral-50 text-brand-950 ${className}`}
    >
      {/* Mobile drawer backdrop */}
      {navOpen ? (
        <button
          type="button"
          className="absolute inset-0 z-30 bg-brand-950/40 md:hidden"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <Sidebar
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col bg-white">
        {/* Mobile top bar */}
        <div className="flex h-12 shrink-0 items-center gap-3 border-b border-dash-line bg-dash-sidebar px-3 md:hidden">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-dash-line bg-white text-brand-950"
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((v) => !v)}
          >
            {navOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
          <Logo href={null} height={22} className="text-brand-950" />
          <span className="ml-auto text-xs font-medium text-neutral-500">Leads</span>
        </div>

        <LeadsTable />
      </main>
    </div>
  );
}
