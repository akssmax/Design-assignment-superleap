"use client";

import { useState } from "react";
import type { DesignToolMode } from "@/components/social-tool/DesignToolHeader";
import { SocialWorkspace } from "@/components/social-tool/SocialWorkspace";
import { SlidesWorkspace } from "@/components/slides/SlidesWorkspace";
import "./social-tool.css";

export function SocialToolPage() {
  const [mode, setMode] = useState<DesignToolMode>("social");

  if (mode === "slides") {
    return <SlidesWorkspace mode={mode} onModeChange={setMode} />;
  }

  return <SocialWorkspace mode={mode} onModeChange={setMode} />;
}
