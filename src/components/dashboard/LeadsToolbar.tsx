"use client";

import {
  ChevronDown,
  Download,
  Filter,
  Plus,
  Search,
  Settings2,
  ArrowUpDown,
} from "lucide-react";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function LeadsToolbar({ search, onSearchChange }: Props) {
  return (
    <div className="shrink-0 space-y-3 border-b border-dash-line bg-white px-3 pt-3 pb-3 sm:space-y-4 sm:px-5 sm:pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <nav
          className="flex shrink-0 items-center gap-1.5 text-sm text-neutral-500"
          aria-label="Breadcrumb"
        >
          <button
            type="button"
            className="inline-flex items-center gap-1 font-medium text-brand-950"
          >
            Leads
            <ChevronDown className="size-3.5 opacity-60" aria-hidden />
          </button>
          <span className="text-neutral-300">/</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 font-medium text-brand-950"
          >
            All Leads
            <ChevronDown className="size-3.5 opacity-60" aria-hidden />
          </button>
        </nav>

        <div className="relative w-full min-w-0 flex-1 sm:mx-auto sm:max-w-md">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search...."
            className="h-9 w-full rounded-lg border border-dash-line bg-neutral-50 pr-3 pl-9 text-sm text-brand-950 outline-none placeholder:text-neutral-400 focus:border-accent-sky/40 focus:ring-2 focus:ring-accent-sky/15"
            aria-label="Search leads"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden h-9 items-center rounded-lg border border-dash-line bg-white px-3 text-sm font-medium text-brand-950 transition hover:bg-neutral-50 sm:inline-flex"
          >
            Save as Smartboard
          </button>
          <button
            type="button"
            aria-label="Download"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-dash-line bg-white text-brand-950 transition hover:bg-neutral-50"
          >
            <Download className="size-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-brand-950 px-3.5 text-sm font-semibold text-white transition hover:bg-brand-900 sm:flex-initial"
          >
            <Plus className="size-4" aria-hidden />
            <span className="sm:inline">Create Lead</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium whitespace-nowrap text-neutral-600 transition hover:bg-neutral-50 sm:px-2.5"
          >
            <ArrowUpDown className="size-3.5" aria-hidden />
            Sort
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium whitespace-nowrap text-neutral-600 transition hover:bg-neutral-50 sm:px-2.5"
          >
            <Filter className="size-3.5" aria-hidden />
            Filter
          </button>
        </div>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-sm font-medium whitespace-nowrap text-neutral-600 transition hover:bg-neutral-50 sm:px-2.5"
        >
          <Settings2 className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">View Settings</span>
          <span className="sm:hidden">View</span>
        </button>
      </div>
    </div>
  );
}
