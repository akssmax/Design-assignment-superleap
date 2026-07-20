"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { ColorScale, Shade } from "@/lib/design-tokens";
import {
  colorScales,
  gradients,
  legacyFigmaMap,
  semanticTokens,
} from "@/lib/design-tokens";
import { Logo, logoAnimations, type LogoAnimation } from "@/components/Logo";
import { HeroMonogramPatternField } from "@/components/patterns/HeroMonogramPattern";
import { MonogramCutout } from "@/components/patterns/MonogramCutout";
import {
  MonogramPattern,
  type MonogramPatternVariant,
} from "@/components/patterns/MonogramPattern";

function contrastText(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luma > 0.55 ? "#0B3833" : "#F4F6F6";
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="inline-flex items-center gap-1 rounded-md border border-leap-line bg-leap-soft px-2 py-1 text-[11px] text-leap-mist transition hover:text-leap-fg"
      aria-label={`Copy ${value}`}
    >
      {copied ? <Check className="h-3 w-3 text-brand-500" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ShadeCard({ scaleId, shade }: { scaleId: string; shade: Shade }) {
  const fg = contrastText(shade.hex);
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-leap-line bg-leap-surface">
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(shade.hex);
        }}
        className="relative h-28 w-full transition group-hover:brightness-[1.03]"
        style={{ background: shade.hex, color: fg }}
        title="Click to copy hex"
      >
        <span className="absolute left-3 top-3 font-display text-sm font-semibold tabular-nums">
          {shade.step}
        </span>
        {shade.source ? (
          <span className="absolute bottom-3 left-3 right-3 truncate rounded-full bg-black/25 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
            {shade.source}
          </span>
        ) : null}
      </button>
      <div className="space-y-1.5 p-3">
        <p className="font-mono text-xs font-medium text-leap-fg">
          {scaleId}-{shade.step}
        </p>
        <p className="font-mono text-[11px] text-leap-mist">{shade.hex}</p>
        <div className="flex gap-1.5 pt-1">
          <CopyButton value={shade.hex} />
          <CopyButton value={`bg-${scaleId}-${shade.step}`} />
        </div>
      </div>
    </div>
  );
}

function ScaleSection({ scale }: { scale: ColorScale }) {
  return (
    <section id={scale.id} className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-leap-fg sm:text-3xl">
            {scale.name}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-leap-mist">{scale.description}</p>
        </div>
        <p className="font-mono text-xs text-leap-mist">12 shades · hex</p>
      </div>

      {/* Continuous strip */}
      <div className="mt-6 flex h-14 overflow-hidden rounded-2xl border border-leap-line">
        {scale.shades.map((shade) => (
          <div
            key={shade.step}
            className="relative flex-1"
            style={{ background: shade.hex }}
            title={`${scale.id}-${shade.step}`}
          >
            <span
              className="absolute inset-x-0 bottom-1 text-center text-[9px] font-medium tabular-nums"
              style={{ color: contrastText(shade.hex) }}
            >
              {shade.step}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {scale.shades.map((shade) => (
          <ShadeCard key={shade.step} scaleId={scale.id} shade={shade} />
        ))}
      </div>
    </section>
  );
}

export function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-leap-bg text-leap-fg">
      <header className="border-b border-leap-line bg-leap-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <Logo href="/" height={26} />
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">
              Design system · Colors
            </p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {colorScales.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-leap-line bg-leap-soft px-3 py-1.5 text-leap-mist transition hover:text-leap-fg"
              >
                {s.name}
              </a>
            ))}
            <a
              href="#gradients"
              className="rounded-full border border-leap-line bg-leap-soft px-3 py-1.5 text-leap-mist transition hover:text-leap-fg"
            >
              Gradients
            </a>
            <a
              href="#semantics"
              className="rounded-full border border-leap-line bg-leap-soft px-3 py-1.5 text-leap-mist transition hover:text-leap-fg"
            >
              Semantics
            </a>
            <a
              href="#components"
              className="rounded-full border border-leap-line bg-leap-soft px-3 py-1.5 text-leap-mist transition hover:text-leap-fg"
            >
              Components
            </a>
            <a
              href="#usage"
              className="rounded-full border border-leap-line bg-leap-soft px-3 py-1.5 text-leap-mist transition hover:text-leap-fg"
            >
              Usage
            </a>
            <a
              href="/"
              className="rounded-full bg-brand-500 px-3 py-1.5 font-medium text-white transition hover:bg-brand-600"
            >
              Home
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-20 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <section className="max-w-3xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-leap-fg sm:text-4xl">
            Figma primitives → semantic Surface / Brand / Text.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-leap-mist">
            Hex scales from Neutrals (Grays) and Brand. Semantic Mode 1 (light) from
            Refined tokens maps onto them; dark inverts surfaces and text. Prefer{" "}
            <code className="font-mono text-xs text-leap-fg">bg-surface-*</code>,{" "}
            <code className="font-mono text-xs text-leap-fg">text-text-*</code>, and{" "}
            <code className="font-mono text-xs text-leap-fg">bg-brand-*</code> over raw hex.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white">
              brand-500 · #4BB793
            </span>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-950">
              brand-100 · #E3FFCC
            </span>
            <span className="rounded-full bg-brand-950 px-3 py-1 text-xs font-medium text-brand-100">
              brand-950 · #040C0B
            </span>
            <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-800">
              gray-200 · #D7D9D8
            </span>
          </div>
        </section>

        {colorScales.map((scale) => (
          <ScaleSection key={scale.id} scale={scale} />
        ))}

        <section id="gradients" className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold text-leap-fg sm:text-3xl">
            Gradients
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-leap-mist">
            Brand washes for dark heroes. Use{" "}
            <code className="font-mono text-xs text-leap-fg">.hero-gradient</code> or{" "}
            <code className="font-mono text-xs text-leap-fg">var(--gradient-hero)</code>.
          </p>
          <div className="mt-6 space-y-6">
            {gradients.map((g) => (
              <div
                key={g.name}
                className="overflow-hidden rounded-2xl border border-leap-line bg-leap-surface"
              >
                <div
                  className="relative flex min-h-40 flex-col justify-end p-6 text-white"
                  style={{ background: g.css }}
                >
                  <p className="font-display text-xl font-semibold">{g.name}</p>
                  <p className="mt-1 text-sm text-white/70">{g.usage}</p>
                </div>
                <div className="border-t border-leap-line px-4 py-3">
                  <pre className="overflow-x-auto font-mono text-[11px] text-leap-mist">
                    {`background: ${g.css};`}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="semantics" className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold text-leap-fg sm:text-3xl">
            Semantic aliases
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-leap-mist">
            Theme-aware tokens used across the product. Light / dark map onto the
            scales above.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-leap-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-leap-elevated/60 text-xs uppercase tracking-wider text-leap-mist">
                <tr>
                  <th className="px-4 py-3 font-medium">Token</th>
                  <th className="px-4 py-3 font-medium">Light</th>
                  <th className="px-4 py-3 font-medium">Dark</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Usage</th>
                </tr>
              </thead>
              <tbody>
                {semanticTokens.flatMap((group) =>
                  group.tokens.map((row) => (
                    <tr
                      key={`${group.group}-${row.name}`}
                      className="border-t border-leap-line"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-brand-600 dark:text-brand-400">
                        --{group.group.toLowerCase()}-{row.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-leap-fg">
                        {row.light}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-leap-fg">
                        {row.dark}
                      </td>
                      <td className="hidden px-4 py-3 text-leap-mist sm:table-cell">
                        {row.usage}
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="figma" className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold text-leap-fg sm:text-3xl">
            Figma → scale map
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-leap-mist">
            Original variable names were not lightness-ordered. This table shows where
            each Figma hex landed on the new Tailwind-style scale.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {legacyFigmaMap.map((row) => (
              <div
                key={row.figma}
                className="flex items-center gap-3 rounded-xl border border-leap-line bg-leap-surface px-3 py-2.5"
              >
                <span
                  className="h-8 w-8 shrink-0 rounded-full border border-leap-line"
                  style={{ background: row.hex }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs text-leap-fg">{row.figma}</p>
                  <p className="font-mono text-[11px] text-leap-mist">{row.hex}</p>
                </div>
                <span className="shrink-0 rounded-full bg-brand-500/15 px-2 py-0.5 font-mono text-[11px] text-brand-700 dark:text-brand-300">
                  → {row.mapsTo}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section id="components" className="scroll-mt-24">
          <h2 className="font-display text-2xl font-semibold text-leap-fg sm:text-3xl">
            Components
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-leap-mist">
            Custom brand primitives from the Superleap Figma library.
          </p>

          <div className="mt-8 space-y-8">
            <div className="overflow-hidden rounded-2xl border border-leap-line bg-leap-surface">
              <div className="border-b border-leap-line px-5 py-4 sm:px-6">
                <p className="font-display text-lg font-semibold text-leap-fg">
                  Logo
                </p>
                <p className="mt-1 text-sm text-leap-mist">
                  Official lockup with Framer Motion mark presets via{" "}
                  <code className="font-mono text-xs text-leap-fg">animation</code>
                  . Hover cards that support it. Respects{" "}
                  <code className="font-mono text-xs text-leap-fg">
                    prefers-reduced-motion
                  </code>
                  .
                </p>
              </div>
              <div className="grid gap-px bg-leap-line sm:grid-cols-2 lg:grid-cols-3">
                {(
                  [
                    ["none", "Static"],
                    ["leap", "Leap — hover"],
                    ["assemble", "Assemble — mount"],
                    ["wave", "Wave — idle"],
                    ["glint", "Glint — hover"],
                  ] as const satisfies ReadonlyArray<
                    readonly [LogoAnimation, string]
                  >
                ).map(([animation, label]) => (
                  <div
                    key={animation}
                    className="flex flex-col items-center justify-center gap-3 bg-leap-bg px-4 py-8"
                  >
                    <p className="text-[11px] font-medium tracking-wide text-leap-mist uppercase">
                      {label}
                    </p>
                    <Logo
                      href={null}
                      height={32}
                      animation={animation}
                      className="text-leap-fg"
                    />
                    <code className="font-mono text-[10px] text-leap-mist">
                      animation=&quot;{animation}&quot;
                    </code>
                  </div>
                ))}
                <div className="flex flex-col items-center justify-center gap-3 bg-[linear-gradient(180deg,#064d4c_0%,#091a24_70%)] px-4 py-8 text-white">
                  <p className="text-[11px] font-medium tracking-wide text-brand-100/70 uppercase">
                    Mark only · leap
                  </p>
                  <Logo
                    href={null}
                    variant="mark"
                    height={40}
                    animation="leap"
                    className="text-white"
                  />
                  <code className="font-mono text-[10px] text-brand-100/60">
                    variant=&quot;mark&quot;
                  </code>
                </div>
              </div>
              <div className="border-t border-leap-line p-5 sm:p-6">
                <pre className="overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-[12px] leading-relaxed text-brand-100">
{`import { Logo, type LogoAnimation } from "@/components/Logo";
// presets: ${logoAnimations.join(" | ")}

<Logo height={28} animation="leap" />
<Logo variant="mark" animation="glint" />`}
                </pre>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-leap-line bg-leap-surface">
              <div className="border-b border-leap-line px-5 py-4 sm:px-6">
                <p className="font-display text-lg font-semibold text-leap-fg">
                  MonogramPattern
                </p>
                <p className="mt-1 text-sm text-leap-mist">
                  Figma node{" "}
                  <code className="font-mono text-xs text-leap-fg">30:1432</code>{" "}
                  · variants{" "}
                  <code className="font-mono text-xs text-leap-fg">default</code>
                  ,{" "}
                  <code className="font-mono text-xs text-leap-fg">highlight</code>
                  ,{" "}
                  <code className="font-mono text-xs text-leap-fg">solid</code>.
                  Used in the site footer.
                </p>
              </div>
              <div className="grid gap-px bg-leap-line sm:grid-cols-3">
                {(
                  [
                    ["default", "Default"],
                    ["highlight", "Variant 2"],
                    ["solid", "Variant 3"],
                  ] as const satisfies ReadonlyArray<
                    readonly [MonogramPatternVariant, string]
                  >
                ).map(([variant, label]) => (
                  <div
                    key={variant}
                    className="overflow-hidden bg-[linear-gradient(180deg,#064d4c_0%,#091a24_70%)]"
                  >
                    <p className="px-4 pt-4 text-[11px] font-medium tracking-wide text-brand-100/70 uppercase">
                      {label}
                    </p>
                    <div className="flex justify-center overflow-hidden py-6">
                      <MonogramPattern variant={variant} tileSize={160} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-leap-line bg-[linear-gradient(180deg,#064d4c_0%,#091a24_70%)] px-4 py-6">
                <p className="mb-3 text-[11px] font-medium tracking-wide text-brand-100/70 uppercase">
                  Interactive — hover middle · click fill
                </p>
                <div className="flex justify-center overflow-hidden">
                  <MonogramPattern tileSize={200} interactive />
                </div>
              </div>
              <div className="border-t border-leap-line p-5 sm:p-6">
                <pre className="overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-[12px] leading-relaxed text-brand-100">
{`import { MonogramPattern } from "@/components/patterns/MonogramPattern";

{/* Static variant */}
<MonogramPattern variant="highlight" tileSize={417} />

{/* Hover → middle fills · Click → full center monogram */}
<MonogramPattern interactive />`}
                </pre>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-leap-line bg-leap-surface">
              <div className="border-b border-leap-line px-5 py-4 sm:px-6">
                <p className="font-display text-lg font-semibold text-leap-fg">
                  MonogramCutout
                </p>
                <p className="mt-1 text-sm text-leap-mist">
                  Diagonal corner cuts matching the monogram parallelogram.
                  Props:{" "}
                  <code className="font-mono text-xs text-leap-fg">cutouts</code>
                  ,{" "}
                  <code className="font-mono text-xs text-leap-fg">depth</code>.
                </p>
              </div>
              <div className="grid gap-px bg-leap-line sm:grid-cols-2">
                <div className="bg-[linear-gradient(180deg,#064d4c_0%,#091a24_100%)] p-6">
                  <MonogramCutout
                    as="div"
                    cutouts={["top-left", "bottom-right"]}
                    depth={16}
                    disableBelowMd={false}
                    className="bg-brand-100 px-6 py-10 text-center text-sm font-medium text-brand-950"
                  >
                    top-left + bottom-right
                  </MonogramCutout>
                </div>
                <div className="bg-[linear-gradient(180deg,#064d4c_0%,#091a24_100%)] p-6">
                  <MonogramCutout
                    as="div"
                    cutouts={["top-right", "bottom-left"]}
                    depth={16}
                    disableBelowMd={false}
                    className="bg-brand-100 px-6 py-10 text-center text-sm font-medium text-brand-950"
                  >
                    top-right + bottom-left
                  </MonogramCutout>
                </div>
              </div>
              <div className="border-t border-leap-line p-5 sm:p-6">
                <pre className="overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-[12px] leading-relaxed text-brand-100">
{`import { MonogramCutout } from "@/components/patterns/MonogramCutout";

<MonogramCutout cutouts={["top-left", "bottom-right"]} depth={14}>
  …
</MonogramCutout>`}
                </pre>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-leap-line bg-leap-surface">
              <div className="border-b border-leap-line px-5 py-4 sm:px-6">
                <p className="font-display text-lg font-semibold text-leap-fg">
                  HeroMonogramPattern
                </p>
                <p className="mt-1 text-sm text-leap-mist">
                  Figma node{" "}
                  <code className="font-mono text-xs text-leap-fg">30:1186</code> ·
                  outline monogram field for dark heroes. Hover to redraw strokes.
                </p>
              </div>
              <div className="relative isolate min-h-[320px] overflow-hidden bg-[linear-gradient(180deg,#064d4c_0%,#091a24_70%)]">
                <HeroMonogramPatternField className="!top-1/2 -translate-y-1/2" />
                <div className="relative z-10 flex h-full min-h-[320px] flex-col items-center justify-center px-6 py-16 text-center">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#e3ffcc]/80">
                    Hover to animate
                  </p>
                  <p className="mt-3 max-w-md font-display text-2xl font-semibold text-[#f8faf9]">
                    Screen-blended outline monogram
                  </p>
                </div>
              </div>
              <div className="border-t border-leap-line p-5 sm:p-6">
                <pre className="overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-[12px] leading-relaxed text-brand-100">
{`import { HeroMonogramPattern } from "@/components/patterns/HeroMonogramPattern";

<section className="relative" onMouseEnter={…} onMouseLeave={…}>
  <HeroMonogramPattern active={hovered} className="w-full" />
</section>`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="usage" className="scroll-mt-24 pb-16">
          <h2 className="font-display text-2xl font-semibold text-leap-fg sm:text-3xl">
            Usage
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-leap-line bg-leap-surface p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-leap-mist">
                Tailwind
              </p>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-[12px] leading-relaxed text-brand-100">
{`<div className="bg-brand-500 text-white" />
<div className="border-neutral-200 text-neutral-700" />
<div className="bg-violet-600" />`}
              </pre>
            </div>
            <div className="rounded-2xl border border-leap-line bg-leap-surface p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-leap-mist">
                CSS variables
              </p>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-neutral-950 p-4 font-mono text-[12px] leading-relaxed text-brand-100">
{`.cta {
  background: var(--brand-500);
  color: var(--brand-25);
}
.card {
  background: var(--neutral-50);
  border-color: var(--neutral-200);
}`}
              </pre>
            </div>
          </div>

          {/* Live pairings */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-brand-500 p-6 text-white">
              <p className="text-xs uppercase tracking-wider text-brand-100">Primary CTA</p>
              <p className="font-display mt-2 text-xl font-semibold">brand-500 on white text</p>
            </div>
            <div className="rounded-2xl bg-brand-100 p-6 text-brand-950">
              <p className="text-xs uppercase tracking-wider text-brand-700">Soft accent</p>
              <p className="font-display mt-2 text-xl font-semibold">brand-100 on brand-950</p>
            </div>
            <div className="rounded-2xl bg-brand-950 p-6 text-brand-100">
              <p className="text-xs uppercase tracking-wider text-brand-400">Dark surface</p>
              <p className="font-display mt-2 text-xl font-semibold">brand-950 on brand-100</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
