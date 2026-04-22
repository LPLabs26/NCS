import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

type ThemeName = "shell" | "sage" | "terracotta" | "ink";

type ReferenceCard = {
  slug: string;
  title: string;
  pillar: string;
  format: "image" | "carousel" | "reel";
  badge: string;
  headline: string;
  body: string;
  cta: string;
  theme: ThemeName;
  caption: string;
  hashtags: string[];
  canvaBuild: string;
  slidePlan?: string[];
  realMediaPriority: string;
  aiFallbackPrompt: string;
  compliance: string;
  logoLockupLabel?: string;
};

const packName = "canva-reference-pack-01";
const outputDir = join(process.cwd(), "exports", packName);

const themes: Record<
  ThemeName,
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

const cards: ReferenceCard[] = [
  {
    slug: "not-sure-what-to-book-start-here",
    title: "Not sure what to book? Start here.",
    pillar: "Offers and availability",
    format: "image",
    badge: "Start Here",
    headline: "Not sure what\nto book?",
    body: "Your skin does not need a random facial. It needs a plan.",
    cta: "Book free consult",
    theme: "shell",
    caption:
      "Your skin does not need a random facial. It needs a plan.\n\nBook a free consult and we’ll talk through your skin goals, current routine, lifestyle, and what treatment makes the most sense for you.",
    hashtags: ["#SkinConsult", "#FresnoFacials", "#NCSAesthetics", "#NorthFresno"],
    canvaBuild:
      "Text-led static post. Keep the headline dominant, use lots of breathing room, and let the CTA pill carry the action.",
    realMediaPriority: "Optional. This works well as a branded text graphic with no photo.",
    aiFallbackPrompt:
      "Editorial skincare consultation mood board, warm cream and terracotta palette, soft diffused light, marble tray, towel folds, skincare notebook, elegant but approachable esthetician studio, no people, vertical 4:5 composition.",
    compliance:
      "Safe first-test post. No pricing, no client claims, no consent-sensitive media required.",
  },
  {
    slug: "what-is-circadia",
    title: "What is Circadia?",
    pillar: "Circadia Pro Skin Systems",
    format: "carousel",
    badge: "Circadia Pro",
    headline: "What is\nCircadia?",
    body: "Professional skincare built around protect by day and repair by night.",
    cta: "Book a consult",
    theme: "ink",
    caption:
      "You’ve seen “Circadia Pro” in my bio — here’s what that means.\n\nCircadia is a professional skincare line built around the skin’s natural rhythms: protect during the day, repair at night.",
    hashtags: ["#CircadiaPro", "#ProfessionalSkincare", "#HomecareEducation", "#NCSAesthetics"],
    canvaBuild:
      "6-slide education carousel. Use the first slide as a dark hero cover, then alternate cream and dark slides for rhythm.",
    slidePlan: [
      "Slide 1: What is Circadia?",
      "Slide 2: Professional line for licensed providers",
      "Slide 3: Protect by day",
      "Slide 4: Repair by night",
      "Slide 5: How NCS uses it in custom planning",
      "Slide 6: Book a consult",
    ],
    realMediaPriority:
      "Use official Circadia product or education visuals only if Natalie has approved usage rights. Otherwise stay text-led.",
    aiFallbackPrompt:
      "Luxury nighttime skincare editorial still life, dark espresso background, soft copper glow, serum bottle silhouettes, botanical shadows, elegant professional skincare mood, no labels, no people, vertical 4:5 composition.",
    compliance:
      "Do not show public Circadia pricing. Do not promote specific Circadia services unless owner has confirmed they are offered.",
    logoLockupLabel: "Official Circadia logo",
  },
  {
    slug: "fresno-spf-reapplication-rules",
    title: "Fresno SPF reapplication rules",
    pillar: "Fresno skin education",
    format: "carousel",
    badge: "Fresno Skin Tips",
    headline: "Fresno SPF\nrules",
    body: "One application is not enough outdoors. Reapply every 2 hours and after sweating.",
    cta: "Save this",
    theme: "sage",
    caption:
      "Fresno sun does not play. If you are working on pigment, texture, acne marks, or aging prevention, SPF has to be part of the plan.\n\nSave this before your next outdoor day.",
    hashtags: ["#FresnoSkincare", "#CentralValleySkin", "#ClovisSkincare", "#NorthFresno", "#NCSAesthetics"],
    canvaBuild:
      "6-slide educational carousel with big numbers, simple icons, and one rule per slide. Keep it fast to read.",
    slidePlan: [
      "Slide 1: Fresno SPF check",
      "Slide 2: Applying once is not enough",
      "Slide 3: Reapply every 2 hours outdoors",
      "Slide 4: Reapply after sweating",
      "Slide 5: Neck, ears, chest, hands",
      "Slide 6: Need help with pigment? Book a consult",
    ],
    realMediaPriority: "Optional. Works as icon-led education without photo assets.",
    aiFallbackPrompt:
      "Fresh summer skincare flat lay, sunscreen tube, sunglasses, linen towel, warm California daylight, soft sage and cream tones, clean editorial styling, no people, vertical 4:5 composition.",
    compliance:
      "Keep this educational, not fear-based. No medical claims about sun damage reversal.",
  },
  {
    slug: "which-hydrafacial-should-you-book",
    title: "Which Hydrafacial should you book?",
    pillar: "Hydrafacial authority",
    format: "carousel",
    badge: "Hydrafacial",
    headline: "Which\nHydrafacial?",
    body: "Express glow, signature reset, or the most elevated experience?",
    cta: "Tap booking link",
    theme: "terracotta",
    caption:
      "Every skin goal does not need the same treatment. Here’s the simple breakdown so you can book with confidence.",
    hashtags: ["#FresnoHydrafacial", "#HydrafacialAuthority", "#NorthFresno", "#NCSAesthetics"],
    canvaBuild:
      "5-slide comparison carousel. Treat each tier like a card with one clear benefit so it feels easy, not technical.",
    slidePlan: [
      "Slide 1: Which Hydrafacial should you book?",
      "Slide 2: Express Hydrafacial = quick glow",
      "Slide 3: Hydrafacial = full reset + booster",
      "Slide 4: Platinum = elevated treatment + extra support",
      "Slide 5: Still unsure? Book a free consult",
    ],
    realMediaPriority:
      "Best with real device, room, or treatment close-ups. If unavailable, use text and subtle water-like texture only.",
    aiFallbackPrompt:
      "High-end skincare treatment room detail, polished chrome machine accents, clean folded towels, glass bowl reflections, warm terracotta and cream palette, spa-luxury editorial look, no people, vertical 4:5 composition.",
    compliance:
      "Do not mention package pricing. Keep benefits claim-safe: designed to, can help, supports, results vary.",
  },
  {
    slug: "fresno-heat-spf-sweat-congested-skin",
    title: "Fresno heat + SPF + sweat = congested skin",
    pillar: "Hydrafacial authority",
    format: "reel",
    badge: "Hydrafacial Reel",
    headline: "Heat + SPF + sweat\n= congestion",
    body: "If your skin feels rough, dull, or overloaded, it may be time for a reset.",
    cta: "Book Hydrafacial",
    theme: "terracotta",
    caption:
      "If your skin feels rough, dull, oily, or like your products are just sitting on top, it might be time for a Hydrafacial reset.",
    hashtags: ["#FresnoHydrafacial", "#FresnoSkincare", "#NorthFresno", "#NCSAesthetics"],
    canvaBuild:
      "Reel cover plus 4 quick text overlays for the edit. Keep the cover bold and the text overlays punchy.",
    slidePlan: [
      "Cover: Heat + SPF + sweat = congested skin",
      "Overlay 1: Skin feeling rough or overloaded?",
      "Overlay 2: Cleanse + exfoliate + extract + hydrate",
      "Overlay 3: Great for congestion, dullness, texture",
      "Overlay 4: Book your Hydrafacial reset",
    ],
    realMediaPriority:
      "Use real Hydrafacial room clips, glove detail, machine passes, towels, water swirl, and post-treatment glow.",
    aiFallbackPrompt:
      "Abstract skincare hydration visual, water ripples, dewy glass reflections, warm peach light, modern spa editorial mood, no faces, no treatment machine logos, vertical 9:16 composition.",
    compliance:
      "No extraction jar close-up unless Natalie wants it. Avoid guaranteed glow language.",
  },
  {
    slug: "protect-by-day-repair-by-night",
    title: "Protect by day, repair by night",
    pillar: "Circadia Pro Skin Systems",
    format: "carousel",
    badge: "Circadia Rhythm",
    headline: "Protect by day.\nRepair by night.",
    body: "Morning and night routines should not do the same job.",
    cta: "Save this",
    theme: "ink",
    caption:
      "Morning skincare is about protection. Night skincare is about repair. This is one of the reasons I love Circadia — the line is built around working with your skin’s natural rhythm.",
    hashtags: ["#ProtectByDay", "#RepairByNight", "#CircadiaPro", "#NCSAesthetics"],
    canvaBuild:
      "Split carousel with a daytime half and nighttime half. Keep sun cues warm and night cues deeper and calmer.",
    slidePlan: [
      "Slide 1: Protect by day. Repair by night.",
      "Slide 2: Morning = SPF, antioxidants, barrier support",
      "Slide 3: Fresno heat and exposure matter",
      "Slide 4: Night = cleanse, hydrate, correct",
      "Slide 5: Circadia follows the skin’s rhythm",
      "Slide 6: Save this + book a custom facial",
    ],
    realMediaPriority:
      "Can be text-led. Optional official Circadia assets require confirmed rights before posting.",
    aiFallbackPrompt:
      "Split-scene skincare editorial, left side golden daylight with citrus glow, right side candlelit evening with deep amber highlights, elegant bottles and linen, no people, vertical 4:5 composition.",
    compliance:
      "Do not show public Circadia product pricing. Keep it education-first, not product-push.",
    logoLockupLabel: "Official Circadia logo",
  },
  {
    slug: "first-brazilian-wax-read-this-first",
    title: "First Brazilian wax? Read this first.",
    pillar: "Waxing comfort and prep",
    format: "carousel",
    badge: "Waxing Prep",
    headline: "First Brazilian?\nRead this first.",
    body: "A smoother wax starts before the appointment.",
    cta: "Book wax",
    theme: "shell",
    caption:
      "Before your wax: let hair grow enough for removal, avoid heavy exfoliation right before, wear loose clothing, skip lotions and oils the day of, and ask questions — comfort matters here.",
    hashtags: ["#FresnoWaxing", "#BrazilianWaxPrep", "#ComfortFirst", "#NCSAesthetics"],
    canvaBuild:
      "5-slide prep checklist carousel. Make it calm, simple, and comfort-first rather than edgy or intimate.",
    slidePlan: [
      "Slide 1: First Brazilian wax? Read this first.",
      "Slide 2: Let hair grow enough",
      "Slide 3: Skip heavy exfoliation right before",
      "Slide 4: Wear loose clothes + skip oils",
      "Slide 5: Ask questions — comfort matters here",
    ],
    realMediaPriority:
      "Do not use intimate visuals. Use soft towels, room detail, wax pot setup, or icon-led layout only.",
    aiFallbackPrompt:
      "Minimal spa prep flat lay, folded towel, wooden sticks, wax warmer silhouette, clean cream palette, comfort-first beauty studio mood, no body parts, vertical 4:5 composition.",
    compliance:
      "Avoid intimate waxing details and before/after content. No pain-free guarantees.",
  },
  {
    slug: "lash-lift-with-tint",
    title: "Lash lift with tint",
    pillar: "Lashes and brows",
    format: "reel",
    badge: "Lash Lift",
    headline: "Lashes without\ndaily mascara",
    body: "Lifted, darker, more polished lashes without extensions.",
    cta: "Book lash lift",
    theme: "sage",
    caption:
      "A lash lift with tint gives your natural lashes a lifted, darker, more polished look without extensions.",
    hashtags: ["#FresnoLashLift", "#LashLift", "#LowMaintenanceBeauty", "#NCSAesthetics"],
    canvaBuild:
      "Reel cover with clean beauty vibe plus 3 short text overlays for the edit.",
    slidePlan: [
      "Cover: Lashes without daily mascara",
      "Overlay 1: Lift + tint your natural lashes",
      "Overlay 2: Great for busy mornings and trips",
      "Overlay 3: Book your lash lift",
    ],
    realMediaPriority:
      "Best with real close-ups of Natalie’s work, eye-safe crop, and clean neutral background. No AI faces for beauty proof.",
    aiFallbackPrompt:
      "Soft-focus beauty editorial background, neutral taupe silk, mirror highlights, clean feminine minimalism, designed as backdrop only, no people, vertical 9:16 composition.",
    compliance:
      "Use real result imagery only with consent. If no real imagery exists yet, keep this text-led.",
  },
  {
    slug: "skincare-should-feel-personal-not-rushed",
    title: "Skincare should feel personal, not rushed.",
    pillar: "Proof and personality",
    format: "image",
    badge: "NCS Aesthetics",
    headline: "Skincare should\nfeel personal.",
    body: "Comfort, education, and a treatment plan that actually makes sense for your skin.",
    cta: "Book with confidence",
    theme: "shell",
    caption:
      "One thing clients mention often: feeling comfortable, heard, and educated during their appointment. That is the goal every time.",
    hashtags: ["#ClientExperience", "#FresnoEsthetician", "#NCSAesthetics", "#LaDamaSalon"],
    canvaBuild:
      "Brand trust static. Pair a strong quote-style headline with an optional candid room or consultation image.",
    realMediaPriority:
      "Best with a real treatment-room detail, consultation table, or Natalie portrait. Can also work text-only.",
    aiFallbackPrompt:
      "Warm esthetician studio consultation scene, empty chair, skincare tools, folded towel, amber daylight, personal and elevated atmosphere, no people, vertical 4:5 composition.",
    compliance:
      "If using a client review screenshot, only use with permission and remove identifying details if not approved.",
  },
  {
    slug: "hydraback",
    title: "Hydraback",
    pillar: "Hydrafacial authority",
    format: "reel",
    badge: "Summer Prep",
    headline: "Your back deserves\nskincare too.",
    body: "Think of it like a Hydrafacial-style reset for an area that is hard to treat at home.",
    cta: "Book Hydraback",
    theme: "terracotta",
    caption:
      "Hydraback is great before weddings, vacations, photos, backless outfits, or anytime your back feels congested.",
    hashtags: ["#Hydraback", "#EventPrep", "#FresnoSkincare", "#NCSAesthetics"],
    canvaBuild:
      "Reel cover with summer-prep energy. Use refined, fashion-adjacent language instead of clinical skin-copy overload.",
    slidePlan: [
      "Cover: Your back deserves skincare too",
      "Overlay 1: Great before vacations or events",
      "Overlay 2: Hard-to-reach areas need support too",
      "Overlay 3: Book Hydraback",
    ],
    realMediaPriority:
      "Use real room prep, towel detail, shoulder/back-friendly framing only if consent is clear and non-sensitive. Otherwise keep it text-led.",
    aiFallbackPrompt:
      "Luxury summer skin-prep mood board, linen robe, neutral stone, soft terracotta sunlight, resort-ready editorial styling, no people, vertical 9:16 composition.",
    compliance:
      "Do not use revealing client imagery without explicit written consent.",
  },
];

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
      lines.push(`- Logo lockup: add the approved ${card.logoLockupLabel} in the reserved top-right area before export.`);
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
  await mkdir(outputDir, { recursive: true });

  await Promise.all(
    cards.map((card, index) =>
      writeFile(
        join(outputDir, `${String(index + 1).padStart(2, "0")}-${card.slug}.html`),
        renderCard(card, index),
        "utf8",
      ),
    ),
  );

  await Promise.all([
    writeFile(join(outputDir, "README.md"), renderReadme(), "utf8"),
    writeFile(join(outputDir, "captions.md"), renderCaptions(), "utf8"),
  ]);

  console.log(`Generated ${cards.length} reference post files in ${outputDir}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
