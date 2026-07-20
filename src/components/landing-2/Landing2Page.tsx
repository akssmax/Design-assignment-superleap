"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Footer } from "@/components/Footer";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { CutoutCTA } from "@/components/landing-2/CutoutCTA";
import { HeroMonogramPattern } from "@/components/patterns/HeroMonogramPattern";
import "./landing-2.css";

const navLinks = [
  { label: "Integrations", href: "#integrations" },
  { label: "Blog", href: "#blog" },
  { label: "Contact Us", href: "#contact" },
  { label: "Login", href: "#login" },
];

const logos = [
  { src: "/landing-2/logo-razorpay.png", alt: "Razorpay" },
  { src: "/landing-2/logo-cars24.png", alt: "Cars24" },
  { src: "/landing-2/logo-aakash.png", alt: "Aakash" },
  { src: "/landing-2/logo-cuemath.png", alt: "Cuemath" },
  { src: "/landing-2/logo-superhealth.png", alt: "Superhealth" },
  { src: "/landing-2/logo-arena.png", alt: "Arena" },
];

const metrics = [
  { value: "5x", label: "Faster Admin Changes", tone: "primary" as const },
  { value: "30%", label: "CRM Cost Savings", tone: "tiber" as const },
  { value: "41%", label: "Reduction in First TAT", tone: "tiber" as const },
  { value: "52min", label: "Daily Time Saved", tone: "primary" as const },
];

function AccentButton({
  href,
  children,
  variant = "accent",
  size = "md",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "accent" | "dark" | "outline";
  size?: "sm" | "md";
}) {
  const styles =
    variant === "accent"
      ? "bg-[var(--l2-accent)] text-[var(--l2-primary)] shadow-[0_2px_6px_rgba(227,255,204,0.24)]"
      : variant === "dark"
        ? "bg-[var(--l2-primary)] text-[var(--l2-accent)]"
        : "border border-current text-current bg-transparent";

  const sizing =
    size === "sm" ? "h-10 px-5 text-sm" : "h-12 px-6 text-base";

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--l2-radius)] transition hover:opacity-90 ${sizing} ${styles}`}
    >
      {children}
      {variant !== "outline" ? (
        <ArrowUpRight className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
      ) : null}
    </a>
  );
}

export function Landing2Page() {
  const [heroPatternActive, setHeroPatternActive] = useState(false);

  return (
    <div className="landing-2 min-h-screen">
      {/* Sticky top nav */}
      <div className="landing-2-nav-chrome sticky top-0 z-50 px-[var(--l2-pad)] pt-6 pb-2">
        <header className="landing-2-nav-bar mx-auto flex max-w-[var(--l2-max)] items-center justify-between rounded-[var(--l2-radius)] shadow-lg shadow-black/10 light:shadow-none">
          <Logo href="/" height={28} className="text-current" animation="leap" />
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-3 text-base tracking-[-0.32px] text-current/90 transition hover:text-[var(--l2-highlight)]"
              >
                {link.label}
              </Link>
            ))}
            <AccentButton href="#cta" size="sm">
              Book a demo
            </AccentButton>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="#cta"
              className="inline-flex items-center gap-1 rounded-[var(--l2-radius)] bg-[var(--l2-accent)] px-4 py-2 text-sm text-[var(--l2-primary)]"
            >
              Book a demo
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </header>
      </div>

      {/* Hero — negative margin pulls gradient under sticky transparent nav chrome */}
      <section
        className="landing-2-hero-gradient relative -mt-[96px] overflow-hidden px-[var(--l2-pad)] pt-[calc(4rem+96px)] pb-28"
        onMouseEnter={() => setHeroPatternActive(true)}
        onMouseLeave={() => setHeroPatternActive(false)}
      >
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center"
          aria-hidden
        >
          <HeroMonogramPattern
            active={heroPatternActive}
            className="h-auto w-[min(1800px,165%)] max-w-none"
          />
        </div>

        <div className="relative z-10 mx-auto mt-20 flex max-w-[1280px] flex-col items-center gap-20">
          <div className="flex max-w-[768px] flex-col items-center gap-8 text-center">
            <div className="space-y-6 text-current">
              <h1 className="text-4xl leading-[1.2] tracking-tight sm:text-5xl md:text-[64px] md:leading-[76.8px]">
                Your Sales Team Just Got an AI Teammate
                <span className="text-[var(--l2-highlight)]">.</span>
              </h1>
              <p className="text-lg leading-7 text-current/80">
                Superleap is an enterprise-grade AI CRM for modern sales teams —
                natively intelligent, flexible by design, fast to implement, and
                built to help you focus on selling while it does the rest.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <AccentButton href="#cta">Book a demo</AccentButton>
              <AccentButton href="#demo" variant="outline">
                Watch 2-Min Demo
              </AccentButton>
            </div>
          </div>

          <div className="aspect-[3/4] w-full overflow-hidden rounded-[var(--l2-radius)] shadow-2xl shadow-black/40 ring-1 ring-black/10 sm:aspect-[4/3] md:aspect-video">
            <div className="h-full w-full bg-neutral-50">
              <DashboardShell className="h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Logo strip */}
      <section className="bg-[var(--l2-surface)] px-[var(--l2-pad)] py-[72px]">
        <div className="mx-auto max-w-[var(--l2-max)]">
          <h2 className="text-center text-lg font-bold tracking-[0.45px] text-[var(--l2-cod-gray)]">
            Trusted by India’s leading businesses
          </h2>
          <div className="mt-8 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {logos.map((logo) => (
              <div
                key={logo.alt}
                className="flex h-[76px] items-center justify-center border-r border-[rgba(20,20,20,0.12)] last:border-r-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-12 w-auto max-w-[140px] object-contain opacity-90"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Efficiency */}
      <section className="relative bg-[var(--l2-brand-950)] px-[var(--l2-pad)] py-32">
        <div className="mx-auto grid max-w-[var(--l2-max)] overflow-hidden rounded-sm lg:grid-cols-[1fr_1.35fr]">
          <aside className="flex flex-col gap-4 border border-[var(--l2-horizon)] bg-[var(--l2-panel)] p-8 sm:p-12">
            <div className="inline-flex w-fit items-center gap-2.5 rounded-[var(--l2-radius)] bg-[var(--l2-accent)] px-2.5 py-1.5">
              <span className="size-3.5 rounded-sm bg-[var(--l2-ocean)]" />
              <span className="text-sm uppercase text-gray-800">
                enterprise security
              </span>
            </div>
            <h2 className="text-4xl leading-none text-[var(--l2-primary)] sm:text-5xl">
              Bring efficiency at
              <br />
              every level.
            </h2>
            <p className="max-w-md text-base leading-6 text-gray-600">
              We’ve removed the friction, buried the complexity, and built speed
              into every layer. Faster admin. Lower costs. Better turnaround.
            </p>
            <div className="mt-4 flex flex-wrap gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/landing-2/stamp-gdpr.png" alt="GDPR" className="size-[100px] sm:size-[120px]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/landing-2/stamp-hipaa.png" alt="HIPAA" className="size-[100px] sm:size-[120px]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/landing-2/stamp-iso.png" alt="ISO" className="size-[100px] sm:size-[120px]" />
            </div>
          </aside>

          <div className="grid sm:grid-cols-2">
            {metrics.map((metric, i) => {
              const bg =
                metric.tone === "primary" ? "bg-[var(--l2-primary)]" : "bg-[var(--l2-tiber)]";
              const corners =
                i === 1
                  ? "rounded-tr-sm"
                  : i === 2
                    ? "rounded-bl-sm"
                    : "";
              return (
                <div
                  key={metric.label}
                  className={`${bg} ${corners} flex min-h-[200px] flex-col justify-between border border-[var(--l2-horizon)] px-10 py-10`}
                >
                  <p className="text-[56px] leading-none text-[var(--l2-text-invert)] sm:text-[72px]">
                    {metric.value}
                  </p>
                  <p className="text-base leading-6 text-[var(--l2-text-invert)]">
                    {metric.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA — monogram cutouts top-left + bottom-right */}
      <CutoutCTA cutouts={["top-left", "bottom-right"]} depth={14}>
        <AccentButton href="mailto:contact@superleap.com" variant="dark">
          Book a demo
        </AccentButton>
      </CutoutCTA>

      {/* Footer — Figma 30:1488 */}
      <Footer id="contact" showTheme />
    </div>
  );
}
