import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { identity } from "@/content/content";

// static export (GitHub Pages): render once at build time
export const dynamic = "force-static";

export const alt = `${identity.name} - ${identity.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const dir = join(process.cwd(), "src", "assets");
  const [anton, mono, serif] = await Promise.all([
    readFile(join(dir, "Anton-Regular.ttf")),
    readFile(join(dir, "JetBrainsMono-Regular.ttf")),
    readFile(join(dir, "InstrumentSerif-Italic.ttf")),
  ]);

  // dithered dot field (deterministic)
  const dots: { x: number; y: number; o: number }[] = [];
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  for (let r = 0; r < 30; r++) {
    for (let c = 0; c < 40; c++) {
      const x = 640 + c * 14;
      const y = 104 + r * 14;
      const v =
        0.5 + 0.5 * Math.sin(c * 0.32 + Math.cos(r * 0.27) * 2) * Math.cos(r * 0.19 - c * 0.05);
      if (v * (c / 40) > (bayer[(r % 4) * 4 + (c % 4)]! + 0.5) / 16 + 0.08)
        dots.push({ x, y, o: v > 0.7 ? 0.9 : 0.45 });
    }
  }

  const ink = "#1E1414";
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#F3EEE6",
        color: ink,
        fontFamily: "Mono",
      }}
    >
      {/* 12-col grid */}
      {Array.from({ length: 13 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 40 + i * 93.3,
            width: 1,
            background: "rgba(30,20,20,0.07)",
          }}
        />
      ))}
      {dots.map((d, i) => (
        <div
          key={`d${i}`}
          style={{
            position: "absolute",
            left: d.x,
            top: d.y,
            width: 4,
            height: 4,
            background: ink,
            opacity: d.o,
          }}
        />
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 48,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          <span>MEM_01 / INDEX</span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 12, height: 12, borderRadius: 12, background: "#7B1E22" }} />
            AHMEDABAD, IN - {identity.coords}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Anton",
              fontSize: 200,
              lineHeight: 0.84,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>MANN</span>
            <span>AHALPARA</span>
          </div>
          <div style={{ display: "flex", marginTop: 26, alignItems: "center", gap: 18 }}>
            <span style={{ fontFamily: "Serif", fontSize: 40 }}>
              Building memory for conversational agents.
            </span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            letterSpacing: 2,
          }}
        >
          <span>AI/ML RESEARCHER - CONVERSATIONAL AI · LLMS · IR</span>
          <span style={{ background: "#7B1E22", color: "#F3EEE6", padding: "4px 10px" }}>
            RESEARCH INTERN @ NTU SENTIC
          </span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Anton", data: anton, weight: 400, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
        { name: "Serif", data: serif, weight: 400, style: "italic" },
      ],
    },
  );
}
