import { ImageResponse } from "next/og";
import { categories, registry } from "@/registry";

export const dynamic = "force-static";
export const alt = "AI-UI · 面向 AI Vibe Coding 的前端组件词典";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// satori 默认字体不含 CJK,分享图文案用 ASCII;品牌色取自 globals.css 的令牌
const colors = {
  canvas: "#09090b",
  panel: "#111213",
  ink: "#efefe9",
  mute: "#969792",
  accent: "#d7ff3c",
} as const;

/** 全站分享卡:条目/分类数量从 registry 派生,加条目后自动更新 */
export default function opengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: colors.canvas,
          backgroundImage: `radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 18, height: 18, backgroundColor: colors.accent }} />
            <span style={{ fontSize: 26, color: colors.mute, letterSpacing: 6 }}>
              FRONTEND COMPONENT DICTIONARY
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 24px",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 999,
              fontSize: 22,
              color: colors.ink,
            }}
          >
            VOL.01
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 148, fontWeight: 700, color: colors.ink, letterSpacing: -6, lineHeight: 1 }}>
            AI-UI
          </div>
          <div style={{ marginTop: 28, display: "flex", fontSize: 44, color: colors.mute, lineHeight: 1.3 }}>
            The component dictionary for AI vibe coding —
          </div>
          <div style={{ marginTop: 8, display: "flex", fontSize: 44, color: colors.ink, lineHeight: 1.3 }}>
            copy the prompt, ship the component.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 24, color: colors.mute }}>
          <span style={{ display: "flex", color: colors.accent, fontWeight: 700 }}>
            {registry.length} COMPONENTS
          </span>
          <span aria-hidden>·</span>
          <span>{categories.length} CATEGORIES</span>
          <span aria-hidden>·</span>
          <span>MCP READY</span>
        </div>
      </div>
    ),
    size,
  );
}
