"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { PostPattern } from "@/components/social-tool/PostPattern";
import { ProductPreview } from "@/components/social-tool/ProductPreview";
import {
  getSocialFont,
  parseAccentMarkup,
  type LogoAlign,
  type LogoPlacement,
  type PatternId,
  type PostCopy,
  type ProductPageId,
  type SocialFontId,
  type TextAlign,
} from "@/lib/social-tool/presets";

export type FeaturedImageTransform = {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
  perspective: number;
};

export const DEFAULT_FEATURED_TRANSFORM: FeaturedImageTransform = {
  x: 0,
  y: 0,
  z: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1,
  perspective: 1400,
};

type Props = {
  width: number;
  height: number;
  copy: PostCopy;
  pattern: PatternId;
  productPage: ProductPageId;
  typeScale?: number;
  logoScale?: number;
  logoAlign?: LogoAlign;
  logoPlacement?: LogoPlacement;
  textAlign?: TextAlign;
  headingFont?: SocialFontId;
  subFont?: SocialFontId;
  showLogo?: boolean;
  showFeaturedImage?: boolean;
  featuredTransform?: FeaturedImageTransform;
  onFeaturedTransformChange?: (next: FeaturedImageTransform) => void;
  /** Preview CSS scale — used to convert screen drag deltas to canvas space */
  previewScale?: number;
  /** Show drag handles / hover chrome (off during export) */
  interactive?: boolean;
  patternOpacity?: number;
  patternScale?: number;
  patternAnimated?: boolean;
  accentPeriod?: boolean;
};

function scale(base: number, width: number) {
  return Math.round(base * (width / 1080));
}

function alignClass(align: LogoAlign | TextAlign) {
  if (align === "left") return "items-start text-left";
  if (align === "right") return "items-end text-right";
  return "items-center text-center";
}

function justifyLogo(align: LogoAlign) {
  if (align === "left") return "justify-start";
  if (align === "right") return "justify-end";
  return "justify-center";
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const HANDLES = ["nw", "ne", "sw", "se", "n", "e", "s", "w"] as const;

export function ProductShotPost({
  width,
  height,
  copy,
  pattern,
  productPage,
  typeScale = 1,
  logoScale = 1,
  logoAlign = "left",
  logoPlacement = "top",
  textAlign = "center",
  headingFont = "sans",
  subFont = "sans",
  showLogo = true,
  showFeaturedImage = true,
  featuredTransform = DEFAULT_FEATURED_TRANSFORM,
  onFeaturedTransformChange,
  previewScale = 1,
  interactive = false,
  patternOpacity = 0.28,
  patternScale = 1,
  patternAnimated = false,
  accentPeriod = true,
}: Props) {
  const canvasRatio = width / 1080;
  const aspect = height / width;
  const isTallPrint = aspect >= 1.8;
  const pad = scale(isTallPrint ? 80 : 64, width);
  const radius = scale(12, width);
  const logoH = Math.max(12, Math.round(34 * canvasRatio * logoScale));
  const footerH = showLogo && logoPlacement === "footer" ? logoH + pad : 0;

  // Tall standees: more room for brand + hierarchy in the upper band
  const textZoneRatio = showFeaturedImage
    ? isTallPrint
      ? Math.min(0.36 + typeScale * 0.03, 0.48)
      : Math.min(0.42 + typeScale * 0.04, 0.58)
    : 0.92;
  const textZone = Math.round(height * textZoneRatio);
  const productZone = showFeaturedImage ? height - textZone - footerH : 0;
  const frameWidth = width - pad;
  const nativeWidth = productPage === "pipeline" ? 980 : 1100;
  const uiScale = frameWidth / nativeWidth;

  const headingParts = parseAccentMarkup(copy.heading);
  const headingFamily = getSocialFont(headingFont).family;
  const subFamily = getSocialFont(subFont).family;
  const fi = featuredTransform;

  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const [dragging, setDragging] = useState(false);

  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const fiRef = useRef(featuredTransform);
  const metricsRef = useRef({ frameWidth, productZone, previewScale });
  const onChangeRef = useRef(onFeaturedTransformChange);
  const bindDragListenersRef = useRef<() => void>(() => {});

  fiRef.current = featuredTransform;
  metricsRef.current = { frameWidth, productZone, previewScale };
  onChangeRef.current = onFeaturedTransformChange;

  const canDrag =
    interactive && typeof onFeaturedTransformChange === "function";

  useEffect(() => {
    if (!interactive) {
      setHovered(false);
      setSelected(false);
      setDragging(false);
      dragRef.current = null;
    }
  }, [interactive]);

  useEffect(() => {
    const onPointerMove = (ev: PointerEvent) => {
      const drag = dragRef.current;
      const onChange = onChangeRef.current;
      if (!drag || !onChange) return;

      const { frameWidth: fw, productZone: pz, previewScale: ps } =
        metricsRef.current;
      const scaleFactor = ps > 0 ? ps : 1;
      const dxPx = (ev.clientX - drag.startX) / scaleFactor;
      const dyPx = (ev.clientY - drag.startY) / scaleFactor;
      const nextX = clamp(drag.originX + (dxPx / Math.max(fw, 1)) * 100, -50, 50);
      const nextY = clamp(
        drag.originY + (dyPx / Math.max(pz, 1)) * 100,
        -50,
        50,
      );

      onChange({
        ...fiRef.current,
        x: Math.round(nextX * 10) / 10,
        y: Math.round(nextY * 10) / 10,
      });
    };

    const endDrag = () => {
      dragRef.current = null;
      setDragging(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };

    bindDragListenersRef.current = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", endDrag);
      window.addEventListener("pointercancel", endDrag);
    };

    return () => {
      endDrag();
    };
  }, []);

  const startDrag = (ev: React.PointerEvent) => {
    if (!canDrag) return;
    ev.preventDefault();
    ev.stopPropagation();
    setSelected(true);
    setDragging(true);
    dragRef.current = {
      startX: ev.clientX,
      startY: ev.clientY,
      originX: fiRef.current.x,
      originY: fiRef.current.y,
    };
    bindDragListenersRef.current();
  };

  const logoEl = showLogo ? (
    <Logo href={null} height={logoH} animation="none" className="text-white" />
  ) : null;

  const chromeActive = hovered || selected || dragging;

  return (
    <div
      className="social-post social-post--dark social-post--product"
      style={
        {
          width,
          height,
          "--sp-pad": `${pad}px`,
          "--sp-type-scale": typeScale,
          "--sp-canvas-ratio": canvasRatio,
          "--sp-heading-font": headingFamily,
          "--sp-sub-font": subFamily,
        } as React.CSSProperties
      }
      onPointerDown={() => {
        if (interactive) setSelected(false);
      }}
    >
      <PostPattern
        pattern={pattern}
        theme="dark"
        opacity={patternOpacity}
        scale={patternScale}
        animated={patternAnimated}
      />

      <div
        className="social-post-product-layout"
        style={{ paddingTop: pad, paddingInline: pad }}
      >
        <div
          className={`social-post-text-zone${isTallPrint ? " social-post-text-zone--tall" : ""}`}
          style={{
            height: showFeaturedImage ? textZone - pad : height - pad - footerH,
            paddingBottom: scale(isTallPrint ? 32 : 20, width),
          }}
        >
          {showLogo && logoPlacement === "top" ? (
            <div className={`flex w-full shrink-0 ${justifyLogo(logoAlign)}`}>
              {logoEl}
            </div>
          ) : null}

          <div
            className={`flex w-full flex-col ${
              isTallPrint
                ? "max-w-none shrink-0 justify-start"
                : "max-w-[920px] flex-1 justify-center self-center"
            } ${alignClass(textAlign)}`}
            style={
              isTallPrint
                ? {
                    marginTop: scale(
                      showLogo && logoPlacement === "top" ? 40 : 8,
                      width,
                    ),
                    gap: scale(8, width),
                  }
                : undefined
            }
          >
            <h1 className="social-post-headline">
              {headingParts.map((part, i) => {
                if (part.type === "br") return <br key={`br-${i}`} />;
                if (part.type === "accent") {
                  return (
                    <span key={`a-${i}`} className="social-post-accent">
                      {part.value}
                    </span>
                  );
                }
                return <span key={`t-${i}`}>{part.value}</span>;
              })}
              {accentPeriod ? (
                <span className="social-post-accent">.</span>
              ) : null}
            </h1>
            <p
              className="social-post-sub"
              style={{ maxWidth: isTallPrint ? "22em" : "28em" }}
            >
              {copy.subheading}
            </p>
            {copy.extraFields.map((field) =>
              field.value.trim() ? (
                <p
                  key={field.id}
                  className="social-post-extra"
                  style={{ maxWidth: isTallPrint ? "22em" : "28em" }}
                >
                  {field.value}
                </p>
              ) : null,
            )}
          </div>
        </div>

        {showFeaturedImage ? (
          <div
            className={`social-post-product-viewport${canDrag ? " is-editable" : ""}`}
            style={
              {
                height: productZone,
                "--fi-perspective": `${fi.perspective}px`,
                "--fi-x": `${fi.x}%`,
                "--fi-y": `${fi.y}%`,
                "--fi-z": `${fi.z}px`,
                "--fi-rx": `${fi.rotateX}deg`,
                "--fi-ry": `${fi.rotateY}deg`,
                "--fi-rz": `${fi.rotateZ}deg`,
                "--fi-scale": fi.scale,
              } as React.CSSProperties
            }
          >
            <div
              className={`social-post-product-frame${chromeActive ? " is-hot" : ""}${dragging ? " is-dragging" : ""}`}
              style={{ borderTopLeftRadius: radius }}
              onPointerEnter={() => {
                if (canDrag) setHovered(true);
              }}
              onPointerLeave={() => {
                if (!dragging) setHovered(false);
              }}
            >
              <div
                className="social-post-product-inner"
                style={{
                  width: nativeWidth,
                  transform: `scale(${uiScale})`,
                  transformOrigin: "top left",
                }}
              >
                <ProductPreview page={productPage} frameWidth={nativeWidth} />
              </div>

              {canDrag ? (
                <div
                  className={`social-fi-chrome${chromeActive ? " is-visible" : ""}`}
                  onPointerDown={startDrag}
                  role="presentation"
                >
                  <div className="social-fi-bounds" />
                  {HANDLES.map((h) => (
                    <span
                      key={h}
                      className={`social-fi-handle social-fi-handle--${h}`}
                      aria-hidden
                    />
                  ))}
                  <span className="social-fi-move-hint" aria-hidden>
                    Drag to move
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {showLogo && logoPlacement === "footer" ? (
          <div
            className={`social-post-logo-footer flex w-full ${justifyLogo(logoAlign)}`}
            style={{
              height: footerH,
              paddingBlock: pad / 2,
              paddingInline: 0,
            }}
          >
            {logoEl}
          </div>
        ) : null}
      </div>
    </div>
  );
}
