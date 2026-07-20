import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads · Superleap",
  description: "Superleap CRM — Leads workspace",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="light" className="min-h-svh bg-neutral-50">
      {children}
    </div>
  );
}
