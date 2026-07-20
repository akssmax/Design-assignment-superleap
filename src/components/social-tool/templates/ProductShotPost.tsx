"use client";

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

type Props = {
  width: number;
  height: number;
  copy: PostCopy;
  pattern: PatternId;
  productPage: ProductPageId;
  /** Scales heading / sub copy only */
  typeScale?: number;
  /** Scales logo only; independent from typeScale */
  logoScale?: number;
  logoAlign?: LogoAlign;
  logoPlacement?: LogoPlacement;
  textAlign?: TextAlign;
  headingFont?: SocialFontId;
  subFont?: SocialFontId;
  showLogo?: boolean;
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
  headingFont = "display",
  subFont = "body",
  showLogo = true,
  accentPeriod = true,
}: Props) {
  const canvasRatio = width / 1080;
  const pad = scale(64, width);
  const radius = scale(12, width);
  const logoH = Math.max(12, Math.round(34 * canvasRatio * logoScale));
  const footerH = showLogo && logoPlacement === "footer" ? logoH + pad : 0;

  const textZoneRatio = Math.min(0.42 + typeScale * 0.04, 0.58);
  const textZone = Math.round(height * textZoneRatio);
  const productZone = height - textZone - footerH;
  const frameWidth = width - pad;
  const nativeWidth = productPage === "pipeline" ? 980 : 1100;
  const uiScale = frameWidth / nativeWidth;

  const headingParts = parseAccentMarkup(copy.heading);
  const headingFamily = getSocialFont(headingFont).family;
  const subFamily = getSocialFont(subFont).family;

  const logoEl = showLogo ? (
    <Logo href={null} height={logoH} animation="none" className="text-white" />
  ) : null;

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
    >
      <PostPattern pattern={pattern} theme="dark" />

      <div
        className="social-post-product-layout"
        style={{ paddingTop: pad, paddingInline: pad }}
      >
        <div
          className="social-post-text-zone"
          style={{ height: textZone - pad, paddingBottom: scale(20, width) }}
        >
          {showLogo && logoPlacement === "top" ? (
            <div className={`flex w-full shrink-0 ${justifyLogo(logoAlign)}`}>
              {logoEl}
            </div>
          ) : null}

          <div
            className={`flex w-full max-w-[920px] flex-1 flex-col justify-center ${alignClass(textAlign)}`}
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
            <p className="social-post-sub" style={{ maxWidth: "28em" }}>
              {copy.subheading}
            </p>
            {copy.extraFields.map((field) =>
              field.value.trim() ? (
                <p
                  key={field.id}
                  className="social-post-extra"
                  style={{ maxWidth: "28em" }}
                >
                  {field.value}
                </p>
              ) : null,
            )}
          </div>
        </div>

        <div
          className="social-post-product-frame"
          style={{
            height: productZone,
            borderTopLeftRadius: radius,
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
        </div>

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
