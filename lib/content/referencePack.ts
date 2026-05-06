export type ReferenceThemeName = "shell" | "sage" | "terracotta" | "ink";

export type ReferenceCard = {
  slug: string;
  title: string;
  pillar: string;
  format: "image" | "carousel" | "reel";
  badge: string;
  headline: string;
  body: string;
  cta: string;
  theme: ReferenceThemeName;
  caption: string;
  hashtags: string[];
  canvaBuild: string;
  slidePlan?: string[];
  realMediaPriority: string;
  aiFallbackPrompt: string;
  compliance: string;
  logoLockupLabel?: string;
};

export const referencePackName = "canva-reference-pack-01";
export const referencePackPublicPath = "/reference-pack-01";

function ensureBookingLinkInBio(value: string): string {
  if (/booking link is in bio|link in bio/i.test(value)) return value;
  return `${value.trim()}\n\nBooking link is in bio.`;
}

function normalizeCta(value: string): string {
  return value.replace(/booking link(?! in bio)/gi, "booking link in bio");
}

function normalizeHashtags(tags: string[]): string[] {
  return Array.from(
    new Set(tags.map((tag) => (tag.toLowerCase() === "#northfresno" ? "#LaDamaSalon" : tag))),
  );
}

const rawReferenceCards: ReferenceCard[] = [
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
    hashtags: ["#SkinConsult", "#FresnoFacials", "#NCSAesthetics", "#LaDamaSalon"],
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
    hashtags: [
      "#FresnoSkincare",
      "#CentralValleySkin",
      "#ClovisSkincare",
      "#LaDamaSalon",
      "#NCSAesthetics",
    ],
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
    cta: "Tap booking link in bio",
    theme: "terracotta",
    caption:
      "Every skin goal does not need the same treatment. Here’s the simple breakdown so you can book with confidence.",
    hashtags: [
      "#FresnoHydrafacial",
      "#HydrafacialAuthority",
      "#LaDamaSalon",
      "#NCSAesthetics",
    ],
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
    hashtags: ["#FresnoHydrafacial", "#FresnoSkincare", "#LaDamaSalon", "#NCSAesthetics"],
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

export const referenceCards: ReferenceCard[] = rawReferenceCards.map((card) => ({
  ...card,
  caption: ensureBookingLinkInBio(card.caption),
  cta: normalizeCta(card.cta),
  hashtags: normalizeHashtags(card.hashtags),
}));
