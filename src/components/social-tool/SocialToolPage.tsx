"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Ban,
  ChevronDown,
  CircleDashed,
  Download,
  Hexagon,
  Loader2,
  PanelBottom,
  PanelsTopLeft,
  PanelTop,
  Plus,
  Shapes,
  Trash2,
} from "lucide-react";
import {
  Button,
  Label,
  Switch,
  TextArea,
  TextField,
} from "@heroui/react";
import { Logo } from "@/components/Logo";
import { ThemeControls } from "@/components/ThemeControls";
import {
  InspectorSegment,
  InspectorSelect,
  InspectorSlider,
  InspectorTransformRow,
} from "@/components/social-tool/InspectorControls";
import {
  ProductShotPost,
  DEFAULT_FEATURED_TRANSFORM,
  type FeaturedImageTransform,
} from "@/components/social-tool/templates/ProductShotPost";
import {
  DEFAULT_COPY,
  PATTERN_OPTIONS,
  PLATFORM_PRESETS,
  PRODUCT_PAGES,
  SOCIAL_FONTS,
  TEMPLATES,
  getPlatform,
  getTemplate,
  platformOptionLabel,
  type LogoAlign,
  type LogoPlacement,
  type PatternId,
  type PlatformId,
  type PostCopy,
  type PostTheme,
  type ProductPageId,
  type SocialFontId,
  type TemplateId,
  type TextAlign,
} from "@/lib/social-tool/presets";
import {
  exportPost,
  type ExportFormat,
} from "@/lib/social-tool/exportPost";
import "./social-tool.css";

const LOGO_PLACEMENT_OPTIONS = [
  { id: "top", label: "Top", icon: PanelTop },
  { id: "footer", label: "Footer", icon: PanelBottom },
] as const;

const ALIGN_OPTIONS = [
  { id: "left", label: "Left", icon: AlignLeft },
  { id: "center", label: "Center", icon: AlignCenter },
  { id: "right", label: "Right", icon: AlignRight },
] as const;

const PATTERN_ICONS = {
  monogram: Hexagon,
  "monogram-soft": CircleDashed,
  footer: PanelsTopLeft,
  outline: Shapes,
  none: Ban,
} as const;

export function SocialToolPage() {
  const [templateId] = useState<TemplateId>("product-shot");
  const [platformId, setPlatformId] = useState<PlatformId>("linkedin-square");
  const [theme, setTheme] = useState<PostTheme>("dark");
  const [pattern, setPattern] = useState<PatternId>("monogram");
  const [patternOpacity, setPatternOpacity] = useState(0.28);
  const [patternScale, setPatternScale] = useState(1);
  const [patternAnimated, setPatternAnimated] = useState(false);
  const [productPage, setProductPage] = useState<ProductPageId>("leads");
  const [typeScale, setTypeScale] = useState(1);
  const [logoScale, setLogoScale] = useState(1);
  const [logoAlign, setLogoAlign] = useState<LogoAlign>("left");
  const [logoPlacement, setLogoPlacement] = useState<LogoPlacement>("top");
  const [showLogo, setShowLogo] = useState(true);
  const [showFeaturedImage, setShowFeaturedImage] = useState(true);
  const [featuredTransform, setFeaturedTransform] =
    useState<FeaturedImageTransform>(DEFAULT_FEATURED_TRANSFORM);
  const [textAlign, setTextAlign] = useState<TextAlign>("center");
  const [headingFont, setHeadingFont] = useState<SocialFontId>("sans");
  const [subFont, setSubFont] = useState<SocialFontId>("sans");
  const [copy, setCopy] = useState<PostCopy>(DEFAULT_COPY["product-shot"]);
  const [exportScale, setExportScale] = useState<1 | 2>(2);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.45);

  const canvasRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  const template = getTemplate(templateId);
  const platform = getPlatform(platformId);

  useEffect(() => {
    const next = getTemplate(templateId);
    setTheme(next.defaultTheme);
    setCopy(DEFAULT_COPY[templateId]);
  }, [templateId]);

  useEffect(() => {
    if (!exportOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!exportMenuRef.current?.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExportOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [exportOpen]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const update = () => {
      const pad = 48;
      const availW = Math.max(el.clientWidth - pad, 200);
      const availH = Math.max(el.clientHeight - pad, 200);
      const sx = availW / platform.width;
      const sy = availH / platform.height;
      setPreviewScale(Math.min(sx, sy, 1));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [platform.width, platform.height]);

  const filename = useMemo(() => {
    return `superleap-${templateId}-${platform.width}x${platform.height}`;
  }, [templateId, platform.width, platform.height]);

  async function handleExport(format: ExportFormat) {
    const node = canvasRef.current;
    if (!node || exporting) return;
    setExporting(format);
    setExportOpen(false);
    // Wait for React to unmount drag chrome before capturing
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    try {
      await exportPost({
        node,
        format,
        width: platform.width,
        height: platform.height,
        scale: exportScale,
        filename,
        backgroundColor: theme === "light" ? "#f8faf9" : "#040c0b",
        printInches: platform.printInches,
      });
    } catch (err) {
      console.error(err);
      alert("Export failed. Try again or use a smaller scale.");
    } finally {
      setExporting(null);
    }
  }

  function updateField<K extends keyof PostCopy>(key: K, value: PostCopy[K]) {
    setCopy((prev) => ({ ...prev, [key]: value }));
  }

  function addExtraField() {
    const n = copy.extraFields.length + 1;
    setCopy((prev) => ({
      ...prev,
      extraFields: [
        ...prev.extraFields,
        {
          id: `field-${Date.now()}`,
          label: `Field ${n}`,
          value: "",
        },
      ],
    }));
  }

  function updateExtraField(id: string, value: string) {
    setCopy((prev) => ({
      ...prev,
      extraFields: prev.extraFields.map((f) =>
        f.id === id ? { ...f, value } : f,
      ),
    }));
  }

  function removeExtraField(id: string) {
    setCopy((prev) => ({
      ...prev,
      extraFields: prev.extraFields.filter((f) => f.id !== id),
    }));
  }

  return (
    <div className="social-tool flex flex-col">
      <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between border-b border-leap-line bg-surface-primary px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            aria-label="Back to home"
            className="inline-flex size-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-surface-secondary hover:text-text-primary"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <Logo href="/" height={24} animation="none" className="text-current" />
          <span className="hidden text-sm text-text-tertiary sm:inline">
            Social Post Designer
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeControls compact />
          <div ref={exportMenuRef} className="relative">
            <Button
              variant="primary"
              isDisabled={!!exporting}
              onPress={() => setExportOpen((o) => !o)}
              aria-expanded={exportOpen}
              aria-haspopup="menu"
            >
              {exporting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              Export
              <ChevronDown className="size-3.5 opacity-70" />
            </Button>
            {exportOpen ? (
              <div
                role="menu"
                className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-leap-line bg-surface-primary p-2 shadow-lg shadow-black/20"
              >
                <p className="px-2 py-1 text-[11px] font-medium tracking-wide text-text-tertiary uppercase">
                  Scale
                </p>
                <div className="mb-2 flex gap-1 px-1">
                  {([1, 2] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setExportScale(s)}
                      className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition ${
                        exportScale === s
                          ? "bg-brand-100 text-brand-950 dark:bg-brand-800 dark:text-brand-100"
                          : "text-text-tertiary hover:bg-surface-secondary hover:text-text-primary"
                      }`}
                    >
                      {s}×
                    </button>
                  ))}
                </div>
                <p className="px-2 py-1 text-[11px] font-medium tracking-wide text-text-tertiary uppercase">
                  Format
                </p>
                {(["png", "jpg", "pdf"] as ExportFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    role="menuitem"
                    disabled={!!exporting}
                    onClick={() => handleExport(fmt)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-text-primary transition hover:bg-surface-secondary disabled:opacity-60"
                  >
                    <Download className="size-3.5 text-text-tertiary" />
                    Download {fmt.toUpperCase()}
                  </button>
                ))}
                <p className="mt-1 border-t border-leap-line px-2 pt-2 text-[11px] leading-4 text-text-tertiary">
                  {platform.width}×{platform.height}
                  {exportScale > 1 ? ` @ ${exportScale}x` : ""}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        {/* Controls */}
        <aside className="social-tool-aside flex min-h-0 w-full shrink-0 flex-col overflow-y-auto overscroll-contain border-b border-leap-line lg:h-full lg:w-[360px] lg:border-r lg:border-b-0">
          {TEMPLATES.length > 1 ? (
            <section className="social-tool-section">
              <span className="social-tool-label">Template</span>
              <div className="mt-2 grid gap-2">
                {TEMPLATES.map((t) => {
                  const active = t.id === templateId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={`rounded-lg border px-3 py-2.5 text-left transition ${
                        active
                          ? "border-brand-500 bg-brand-100/40 text-text-primary dark:bg-brand-900/40"
                          : "border-leap-line hover:border-brand-500/40"
                      }`}
                    >
                      <p className="text-sm font-medium">{t.label}</p>
                      <p className="mt-0.5 text-xs text-text-tertiary">
                        {t.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section className="social-tool-section space-y-3">
            <p className="social-tool-section-title">Canvas</p>
            <InspectorSelect
              label="Platform"
              value={platformId}
              onChange={(v) => {
                const next = v as PlatformId;
                setPlatformId(next);
                // Tall print standees read better with matched left hierarchy
                if (next === "event-standee") {
                  setTextAlign("left");
                  setLogoAlign("left");
                }
              }}
              options={PLATFORM_PRESETS.map((p) => ({
                id: p.id,
                label: platformOptionLabel(p),
                description:
                  p.kind === "print"
                    ? "Print · large-format exhibition"
                    : undefined,
              }))}
            />
            {platform.kind === "print" && platform.printInches ? (
              <p className="text-[11px] leading-4 text-text-tertiary">
                Print layout {platform.printInches.width}×
                {platform.printInches.height} in. PDF exports at true size;
                PNG/JPG use the working canvas ({platform.width}×
                {platform.height}px) × export scale.
              </p>
            ) : null}
          </section>

          <section className="social-tool-section space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="social-tool-section-title !mb-0">Featured image</p>
              <Switch
                size="sm"
                isSelected={showFeaturedImage}
                onChange={setShowFeaturedImage}
                aria-label="Show featured image"
              >
                <Switch.Content>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Content>
              </Switch>
            </div>
            {showFeaturedImage ? (
              <div className="social-transform-panel space-y-3">
                <InspectorSelect
                  label="Product page"
                  value={productPage}
                  onChange={(v) => setProductPage(v as ProductPageId)}
                  options={PRODUCT_PAGES.map((p) => ({
                    id: p.id,
                    label: p.label,
                    description: p.description,
                  }))}
                />

                <div className="social-transform-block">
                  <p className="social-transform-heading">Transform</p>
                  <div className="space-y-3">
                    <InspectorTransformRow
                      label="Position"
                      fields={[
                        {
                          key: "x",
                          value: featuredTransform.x,
                          onChange: (x) =>
                            setFeaturedTransform((prev) => ({ ...prev, x })),
                          step: 1,
                          precision: 1,
                        },
                        {
                          key: "y",
                          value: featuredTransform.y,
                          onChange: (y) =>
                            setFeaturedTransform((prev) => ({ ...prev, y })),
                          step: 1,
                          precision: 1,
                        },
                        {
                          key: "z",
                          value: featuredTransform.z,
                          onChange: (z) =>
                            setFeaturedTransform((prev) => ({ ...prev, z })),
                          step: 5,
                        },
                      ]}
                    />
                    <InspectorSlider
                      label="Scale"
                      value={featuredTransform.scale}
                      onChange={(scale) =>
                        setFeaturedTransform((prev) => ({ ...prev, scale }))
                      }
                      min={0.6}
                      max={1.6}
                      step={0.01}
                      format={(v) => `${v.toFixed(2)}×`}
                    />
                    <InspectorSlider
                      label="Rotate X"
                      value={featuredTransform.rotateX}
                      onChange={(rotateX) =>
                        setFeaturedTransform((prev) => ({ ...prev, rotateX }))
                      }
                      min={-60}
                      max={60}
                      step={1}
                      format={(v) => `${Math.round(v)}°`}
                    />
                    <InspectorSlider
                      label="Rotate Y"
                      value={featuredTransform.rotateY}
                      onChange={(rotateY) =>
                        setFeaturedTransform((prev) => ({ ...prev, rotateY }))
                      }
                      min={-60}
                      max={60}
                      step={1}
                      format={(v) => `${Math.round(v)}°`}
                    />
                    <InspectorSlider
                      label="Rotate Z"
                      value={featuredTransform.rotateZ}
                      onChange={(rotateZ) =>
                        setFeaturedTransform((prev) => ({ ...prev, rotateZ }))
                      }
                      min={-45}
                      max={45}
                      step={1}
                      format={(v) => `${Math.round(v)}°`}
                    />
                    <InspectorSlider
                      label="Perspective"
                      value={featuredTransform.perspective}
                      onChange={(perspective) =>
                        setFeaturedTransform((prev) => ({
                          ...prev,
                          perspective,
                        }))
                      }
                      min={400}
                      max={2400}
                      step={50}
                      format={(v) => `${Math.round(v)}px`}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <section className="social-tool-section space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="social-tool-section-title !mb-0">Logo</p>
              <Switch
                size="sm"
                isSelected={showLogo}
                onChange={setShowLogo}
                aria-label="Show logo"
              >
                <Switch.Content>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                </Switch.Content>
              </Switch>
            </div>
            {showLogo ? (
              <>
                <InspectorSlider
                  label="Scale"
                  value={logoScale}
                  onChange={setLogoScale}
                  min={0.5}
                  max={3}
                  step={0.05}
                  format={(v) => `${v.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}×`}
                  aria-label="Logo scale"
                />
                <div className="social-tool-row">
                  <span className="social-tool-row-label">Placement</span>
                  <InspectorSegment
                    aria-label="Logo placement"
                    value={logoPlacement}
                    onChange={(v) => setLogoPlacement(v as LogoPlacement)}
                    options={[...LOGO_PLACEMENT_OPTIONS]}
                  />
                </div>
                <div className="social-tool-row">
                  <span className="social-tool-row-label">Align</span>
                  <InspectorSegment
                    aria-label="Logo alignment"
                    value={logoAlign}
                    onChange={(v) => setLogoAlign(v as LogoAlign)}
                    options={[...ALIGN_OPTIONS]}
                  />
                </div>
              </>
            ) : null}
          </section>

          <section className="social-tool-section space-y-3">
            <p className="social-tool-section-title">Typography</p>
            <div className="social-tool-row">
              <span className="social-tool-row-label">Align</span>
              <InspectorSegment
                aria-label="Text alignment"
                value={textAlign}
                onChange={(v) => setTextAlign(v as TextAlign)}
                options={[...ALIGN_OPTIONS]}
              />
            </div>
            <InspectorSelect
              label="Heading font"
              value={headingFont}
              onChange={(v) => setHeadingFont(v as SocialFontId)}
              options={SOCIAL_FONTS.map((f) => ({
                id: f.id,
                label: f.label,
                description: f.token,
              }))}
            />
            <InspectorSelect
              label="Subheading font"
              value={subFont}
              onChange={(v) => setSubFont(v as SocialFontId)}
              options={SOCIAL_FONTS.map((f) => ({
                id: f.id,
                label: f.label,
                description: f.token,
              }))}
            />
            <InspectorSlider
              label="Scale"
              value={typeScale}
              onChange={setTypeScale}
              min={0.75}
              max={4}
              step={0.05}
              format={(v) =>
                `${v.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}×`
              }
              aria-label="Copy text scale"
            />
          </section>

          <section className="social-tool-section space-y-3">
            <p className="social-tool-section-title">Pattern</p>
            <InspectorSegment
              aria-label="Background pattern"
              value={pattern}
              onChange={(v) => setPattern(v as PatternId)}
              options={PATTERN_OPTIONS.map((p) => ({
                id: p.id,
                label: p.label,
                icon: PATTERN_ICONS[p.id],
              }))}
            />
            {pattern !== "none" ? (
              <>
                <InspectorSlider
                  label="Opacity"
                  value={patternOpacity}
                  onChange={setPatternOpacity}
                  min={0.05}
                  max={1}
                  step={0.01}
                  format={(v) => `${Math.round(v * 100)}%`}
                />
                <InspectorSlider
                  label="Scale"
                  value={patternScale}
                  onChange={setPatternScale}
                  min={0.5}
                  max={2}
                  step={0.05}
                  format={(v) =>
                    `${v.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}×`
                  }
                />
                <div className="social-tool-row">
                  <span className="social-tool-row-label">Animation</span>
                  <Switch
                    size="sm"
                    isSelected={patternAnimated}
                    onChange={setPatternAnimated}
                    aria-label="Pattern animation"
                  >
                    <Switch.Content>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch.Content>
                  </Switch>
                </div>
              </>
            ) : null}
          </section>

          <section className="social-tool-section space-y-3">
            <p className="social-tool-section-title">Copy</p>
            <TextField
              fullWidth
              name="heading"
              value={copy.heading}
              onChange={(v) => updateField("heading", v)}
            >
              <Label className="social-tool-label">Heading</Label>
              <TextArea rows={3} className="min-h-[4.5rem] resize-y" />
            </TextField>
            <p className="text-[11px] leading-4 text-text-tertiary">
              Wrap accent in [[like this]].
              {template.accentPeriod ? " Mint period is automatic." : null}
            </p>
            <TextField
              fullWidth
              name="subheading"
              value={copy.subheading}
              onChange={(v) => updateField("subheading", v)}
            >
              <Label className="social-tool-label">Subheading</Label>
              <TextArea rows={3} className="min-h-[4.5rem] resize-y" />
            </TextField>

            {copy.extraFields.map((field, idx) => (
              <div key={field.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="social-tool-label !mb-0">
                    Extra {idx + 1}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    isIconOnly
                    aria-label={`Remove field ${idx + 1}`}
                    onPress={() => removeExtraField(field.id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <TextField
                  fullWidth
                  value={field.value}
                  onChange={(v) => updateExtraField(field.id, v)}
                >
                  <TextArea
                    rows={2}
                    className="min-h-[3rem] resize-y"
                    placeholder="Additional line…"
                  />
                </TextField>
              </div>
            ))}

            <Button fullWidth variant="outline" onPress={addExtraField}>
              <Plus className="size-4" />
              Add field
            </Button>
          </section>
        </aside>

        {/* Preview stage */}
        <div
          ref={stageRef}
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto overscroll-contain bg-[color-mix(in_oklab,var(--gray-950)_6%,var(--surface-primary))] p-6 dark:bg-[color-mix(in_oklab,var(--white)_4%,var(--surface-primary))]"
        >
          <div
            className="relative overflow-hidden"
            style={{
              width: platform.width * previewScale,
              height: platform.height * previewScale,
            }}
          >
            <div
              className="origin-top-left"
              style={{
                width: platform.width,
                height: platform.height,
                transform: `scale(${previewScale})`,
                transformOrigin: "top left",
              }}
            >
              <div ref={canvasRef}>
                <ProductShotPost
                  width={platform.width}
                  height={platform.height}
                  copy={copy}
                  pattern={pattern}
                  patternOpacity={patternOpacity}
                  patternScale={patternScale}
                  patternAnimated={patternAnimated && !exporting}
                  productPage={productPage}
                  typeScale={typeScale}
                  logoScale={logoScale}
                  logoAlign={logoAlign}
                  logoPlacement={logoPlacement}
                  showLogo={showLogo}
                  showFeaturedImage={showFeaturedImage}
                  featuredTransform={featuredTransform}
                  onFeaturedTransformChange={setFeaturedTransform}
                  previewScale={previewScale}
                  interactive={!exporting}
                  textAlign={textAlign}
                  headingFont={headingFont}
                  subFont={subFont}
                  accentPeriod={template.accentPeriod}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
