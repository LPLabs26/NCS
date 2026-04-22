import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  referenceCards as cards,
  referencePackName,
  type ReferenceCard,
  type ReferenceThemeName,
} from "@/lib/content/referencePack";

const exportDir = join(process.cwd(), "exports", referencePackName);
const publicDir = join(process.cwd(), "public", "reference-pack-01");

const themes: Record<
  ReferenceThemeName,
  {
    background: string;
    text: string;
    muted: string;
    pill: string;
    pillText: string;
    accent: string;
    orb: string;
  }
> = {
  shell: {
    background: "linear-gradient(180deg, #fbf7f3 0%, #ead9cd 100%)",
    text: "#1d1a17",
    muted: "rgba(29, 26, 23, 0.72)",
    pill: "#1d1a17",
    pillText: "#fff8f2",
    accent: "rgba(255,255,255,0.72)",
    orb: "rgba(255,255,255,0.24)",
  },
  sage: {
    background: "linear-gradient(180deg, #f5f7f2 0%, #dbe5dc 100%)",
    text: "#203126",
    muted: "rgba(32, 49, 38, 0.72)",
    pill: "#203126",
    pillText: "#f6fbf7",
    accent: "rgba(255,255,255,0.72)",
    orb: "rgba(255,255,255,0.24)",
  },
  terracotta: {
    background: "linear-gradient(180deg, #fcf4ef 0%, #e4c2b0 100%)",
    text: "#241815",
    muted: "rgba(36, 24, 21, 0.72)",
    pill: "#91543b",
    pillText: "#fff7f3",
    accent: "rgba(255,255,255,0.72)",
    orb: "rgba(255,255,255,0.22)",
  },
  ink: {
    background: "linear-gradient(180deg, #302725 0%, #171314 100%)",
    text: "#f7efe8",
    muted: "rgba(247, 239, 232, 0.78)",
    pill: "#f7efe8",
    pillText: "#241816",
    accent: "rgba(255,255,255,0.08)",
    orb: "rgba(202, 124, 92, 0.18)",
  },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function renderCard(card: ReferenceCard, index: number) {
  const theme = themes[card.theme];
  const headline = escapeHtml(card.headline).replace(/\n/g, "<br>");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(card.title)}</title>
    <style>
      body {
        margin: 0;
        background: #d8d8d8;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .frame {
        width: 1080px;
        height: 1350px;
        position: relative;
        overflow: hidden;
        background: ${theme.background};
        color: ${theme.text};
      }
      .orb {
        position: absolute;
        border-radius: 999px;
        background: ${theme.orb};
        filter: blur(2px);
      }
      .o1 { width: 380px; height: 380px; right: -88px; top: 62px; }
      .o2 { width: 250px; height: 250px; right: 120px; top: 490px; opacity: 0.75; }
      .o3 { width: 580px; height: 580px; left: -200px; bottom: -180px; opacity: 0.7; }
      .badge {
        position: absolute;
        top: 72px;
        left: 72px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 14px 24px;
        border-radius: 999px;
        background: ${theme.accent};
        border: 1px solid rgba(255,255,255,0.22);
        font-size: 28px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 700;
      }
      .pill {
        position: absolute;
        top: 72px;
        right: 72px;
        padding: 14px 24px;
        border-radius: 999px;
        background: rgba(255,255,255,0.42);
        font-size: 24px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 700;
      }
      .logo-lockup {
        position: absolute;
        top: 72px;
        right: 72px;
        min-width: 260px;
        padding: 18px 20px;
        border-radius: 28px;
        border: 1px dashed rgba(255,255,255,0.34);
        background: rgba(255,255,255,0.08);
        text-align: center;
      }
      .logo-lockup strong {
        display: block;
        font-size: 24px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      .logo-lockup span {
        display: block;
        margin-top: 8px;
        font-size: 18px;
        letter-spacing: 0.04em;
        color: ${theme.muted};
        text-transform: none;
      }
      .headline {
        position: absolute;
        left: 72px;
        right: 92px;
        top: 220px;
        font-family: "Fraunces", ui-serif, Georgia, serif;
        font-size: 106px;
        line-height: 0.92;
        letter-spacing: -0.04em;
        font-weight: 700;
      }
      .body {
        position: absolute;
        left: 80px;
        right: 120px;
        top: 690px;
        font-size: 42px;
        line-height: 1.24;
        color: ${theme.muted};
      }
      .cta {
        position: absolute;
        left: 72px;
        bottom: 108px;
        padding: 28px 42px;
        border-radius: 999px;
        background: ${theme.pill};
        color: ${theme.pillText};
        font-size: 34px;
        font-weight: 800;
      }
      .brand {
        position: absolute;
        right: 72px;
        bottom: 116px;
        font-size: 28px;
        color: ${theme.muted};
      }
      .meta {
        position: absolute;
        left: 72px;
        right: 72px;
        bottom: 44px;
        display: flex;
        justify-content: space-between;
        font-size: 22px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: ${theme.muted};
      }
    </style>
  </head>
  <body>
    <div class="frame" aria-label="${escapeAttribute(card.title)}">
      <div class="orb o1"></div>
      <div class="orb o2"></div>
      <div class="orb o3"></div>
      <div class="badge">${escapeHtml(card.badge)}</div>
      ${
        card.logoLockupLabel
          ? `<div class="logo-lockup"><strong>${escapeHtml(card.logoLockupLabel)}</strong><span>drop approved PNG/SVG here</span></div>`
          : `<div class="pill">${escapeHtml(card.format)}</div>`
      }
      <div class="headline">${headline}</div>
      <div class="body">${escapeHtml(card.body)}</div>
      <div class="cta">${escapeHtml(card.cta)}</div>
      <div class="brand">NCS Aesthetics</div>
      <div class="meta">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <span>${escapeHtml(card.pillar)}</span>
      </div>
    </div>
  </body>
</html>
`;
}

function renderReadme() {
  const lines: string[] = [
    "# Canva Reference Pack 01",
    "",
    "This pack gives NCS Aesthetics a first batch of 10 branded reference posts.",
    "",
    "How to use this pack:",
    "1. Open each HTML file in a browser for the visual direction.",
    "2. Rebuild the final post in Canva using the matching notes below.",
    "3. Use real NCS media first whenever possible.",
    "4. Use the AI fallback prompt only when a real photo or clip is not available.",
    "5. Upload the exported Canva asset into the scheduler and attach it to the matching seeded post title.",
    "",
    "Important:",
    "- These are reference visuals, not published posts.",
    "- Keep `DRY_RUN=true` and `LIVE_CRON_ENABLED=false`.",
    "- Do not show package pricing or Circadia retail pricing publicly.",
    "- Do not use client before/after or intimate-service media without explicit consent.",
    "",
  ];

  cards.forEach((card, index) => {
    lines.push(`## ${String(index + 1).padStart(2, "0")} - ${card.title}`);
    lines.push(`- File: \`${String(index + 1).padStart(2, "0")}-${card.slug}.html\``);
    lines.push(`- Format: ${card.format}`);
    lines.push(`- Pillar: ${card.pillar}`);
    lines.push(`- Canva build: ${card.canvaBuild}`);
    if (card.logoLockupLabel) {
      lines.push(
        `- Logo lockup: add the approved ${card.logoLockupLabel} in the reserved top-right area before export.`,
      );
    }
    if (card.slidePlan) {
      lines.push("- Slide / overlay plan:");
      card.slidePlan.forEach((item) => lines.push(`  - ${item}`));
    }
    lines.push(`- Real media priority: ${card.realMediaPriority}`);
    lines.push(`- OpenAI fallback prompt: ${card.aiFallbackPrompt}`);
    lines.push(`- Compliance: ${card.compliance}`);
    lines.push("");
  });

  return `${lines.join("\n")}\n`;
}

function renderCaptions() {
  const lines: string[] = ["# Canva Reference Pack 01 Captions", ""];

  cards.forEach((card, index) => {
    lines.push(`## ${String(index + 1).padStart(2, "0")} - ${card.title}`);
    lines.push(card.caption);
    lines.push("");
    lines.push(card.hashtags.join(" "));
    lines.push("");
  });

  return `${lines.join("\n")}\n`;
}

async function main() {
  await Promise.all([mkdir(exportDir, { recursive: true }), mkdir(publicDir, { recursive: true })]);

  await Promise.all(
    cards.flatMap((card, index) => {
      const filename = `${String(index + 1).padStart(2, "0")}-${card.slug}.html`;
      const html = renderCard(card, index);

      return [
        writeFile(join(exportDir, filename), html, "utf8"),
        writeFile(join(publicDir, filename), html, "utf8"),
      ];
    }),
  );

  await Promise.all([
    writeFile(join(exportDir, "README.md"), renderReadme(), "utf8"),
    writeFile(join(exportDir, "captions.md"), renderCaptions(), "utf8"),
  ]);

  console.log(`Generated ${cards.length} reference post files in ${exportDir}`);
  console.log(`Generated app preview files in ${publicDir}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
