"use client";

import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type FilterFn,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { LEADS } from "@/lib/dashboard/leads-data";
import type { Lead } from "@/lib/dashboard/types";
import { InterestChip } from "./InterestChip";
import { SourceChip } from "./SourceChip";
import { LeadsToolbar } from "./LeadsToolbar";

const columnHelper = createColumnHelper<Lead>();

const globalFilterFn: FilterFn<Lead> = (row, _columnId, filterValue) => {
  const q = String(filterValue ?? "")
    .toLowerCase()
    .trim();
  if (!q) return true;
  const { name, email, city, phone, source, interestedIn } = row.original;
  return [name, email, city, phone, source, interestedIn].some((v) =>
    v.toLowerCase().includes(q),
  );
};

const columns = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="size-3.5 rounded border-neutral-300 accent-brand-800"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="size-3.5 rounded border-neutral-300 accent-brand-800"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        aria-label={`Select ${row.original.name}`}
      />
    ),
    size: 40,
  }),
  columnHelper.accessor("name", {
    header: "Lead name",
    cell: ({ getValue }) => (
      <div className="group flex items-center gap-2">
        <span className="font-medium text-brand-950">{getValue()}</span>
        <button
          type="button"
          className="rounded p-0.5 text-neutral-400 opacity-0 transition group-hover:opacity-100 hover:bg-neutral-100 hover:text-brand-950"
          aria-label="Row actions"
        >
          <MoreVertical className="size-3.5" />
        </button>
      </div>
    ),
  }),
  columnHelper.accessor("phone", {
    header: "Phone",
    cell: ({ getValue }) => (
      <span className="tabular-nums text-neutral-700">{getValue()}</span>
    ),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: ({ getValue }) => (
      <a
        href={`mailto:${getValue()}`}
        className="inline-flex max-w-[220px] truncate rounded-md border border-accent-sky/25 bg-accent-sky-soft/60 px-2 py-0.5 text-[13px] text-dash-email hover:underline"
      >
        {getValue()}
      </a>
    ),
  }),
  columnHelper.accessor("city", {
    header: "City",
    cell: ({ getValue }) => <span className="text-neutral-700">{getValue()}</span>,
  }),
  columnHelper.accessor("source", {
    header: "Source",
    cell: ({ getValue }) => <SourceChip source={getValue()} />,
  }),
  columnHelper.accessor("interestedIn", {
    header: "Interested in",
    cell: ({ getValue }) => <InterestChip interest={getValue()} />,
  }),
];

export function LeadsTable() {
  const [search, setSearch] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const data = useMemo(() => LEADS, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: search,
      rowSelection,
    },
    onGlobalFilterChange: setSearch,
    onRowSelectionChange: setRowSelection,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 12, pageIndex: 0 },
    },
    enableRowSelection: true,
  });

  const filteredCount = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;

  const pageButtons = useMemo(() => {
    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }
    const pages: (number | "ellipsis")[] = [0, 1, 2, 3, 4];
    if (pageIndex > 4 && pageIndex < pageCount - 1) {
      return [0, "ellipsis" as const, pageIndex, "ellipsis" as const, pageCount - 1];
    }
    pages.push("ellipsis", pageCount - 1);
    return pages;
  }, [pageCount, pageIndex]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <LeadsToolbar search={search} onSearchChange={setSearch} />

      <div className="min-h-0 flex-1 overflow-auto px-2 py-2 sm:px-5 sm:py-3">
        <div className="overflow-x-auto overflow-hidden rounded-lg border border-dash-line bg-white">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm md:min-w-[960px]">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="bg-neutral-50/90">
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="border-b border-dash-line px-3 py-2.5 text-[10px] font-bold tracking-[0.06em] text-neutral-600 uppercase"
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-dash-line last:border-b-0 hover:bg-neutral-25/80"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2.5 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-12 text-center text-sm text-neutral-500"
                  >
                    No leads match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-t border-dash-line bg-white px-3 sm:gap-4 sm:px-5">
        <p className="shrink-0 text-xs text-neutral-500 sm:text-sm">
          <span className="font-medium text-brand-950">{filteredCount}</span> items
        </p>

        <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-1">
          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-30"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </button>

          {pageButtons.map((p, i) =>
            p === "ellipsis" ? (
              <span key={`e-${i}`} className="px-1 text-sm text-neutral-400">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => table.setPageIndex(p)}
                className={`flex size-8 shrink-0 items-center justify-center rounded-md text-sm font-medium transition ${
                  pageIndex === p
                    ? "border border-accent-sky/50 bg-accent-sky-soft text-accent-sky"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
                aria-current={pageIndex === p ? "page" : undefined}
              >
                {p + 1}
              </button>
            ),
          )}

          <button
            type="button"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-30"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="hidden w-20 sm:block" aria-hidden />
      </div>
    </div>
  );
}
