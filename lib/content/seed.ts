import { addDays, set } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import { appTimezone } from "@/lib/env";
import type { ContentTemplateInsert, PostFormat, PostInsert } from "@/types/database";

type SeedPostBlueprint = {
  dayOffset: number;
  hour: number;
  minute: number;
  title: string;
  format: PostFormat;
  pillar: string;
  caption: string;
  cta: string;
  hashtags: string[];
  requiresPriceVerification?: boolean;
  requiresOwnerServiceConfirmation?: boolean;
  requiresBrandAssetRights?: boolean;
  hidePublicProductPricing?: boolean;
};

const hashtagBank = [
  "#FresnoEsthetician",
  "#FresnoSkincare",
  "#FresnoHydrafacial",
  "#NorthFresno",
  "#NCSAesthetics",
  "#LaDamaSalon",
];

const circadiaTags = [
  "#Circadia",
  "#CircadiaPro",
  "#CustomFacial",
  "#PeelEducation",
  "#BarrierSupport",
  "#ProtectByDay",
  "#RepairByNight",
  "#ProfessionalSkincare",
  "#HomecareEducation",
];

const seedBlueprints: SeedPostBlueprint[] = [
  {
    dayOffset: 1,
    hour: 9,
    minute: 0,
    title: "Fresno heat + SPF + sweat = congested skin",
    format: "reel",
    pillar: "Hydrafacial authority",
    caption:
      "If your skin feels rough, dull, oily, or like your products are just sitting on top, it might be time for a Hydrafacial reset.\n\nThis treatment is designed to deeply cleanse, exfoliate, extract, hydrate, and support your glow in one appointment.\n\nPerfect for:\n- Congested pores\n- Texture\n- Dullness\n- Dehydration\n- Pre-event glow\n\nBook your Hydrafacial through the link in bio. Results vary.",
    cta: "Book Hydrafacial.",
    hashtags: hashtagBank,
  },
  {
    dayOffset: 2,
    hour: 11,
    minute: 0,
    title: "Fresno SPF reapplication rules",
    format: "carousel",
    pillar: "Fresno skin education",
    caption:
      "Fresno sun does not play. If you are working on pigment, texture, acne marks, or aging prevention, SPF has to be part of the plan.\n\nApplying SPF once is not enough outdoors. Reapply every 2 hours, reapply after sweating, and do not forget the neck, ears, chest, and hands.\n\nSave this before your next outdoor day.",
    cta: "Save + book consult.",
    hashtags: [
      "#FresnoSkincare",
      "#CentralValleySkin",
      "#ClovisSkincare",
      "#NorthFresno",
      "#NCSAesthetics",
    ],
  },
  {
    dayOffset: 3,
    hour: 13,
    minute: 0,
    title: "What is your biggest skin issue right now?",
    format: "story",
    pillar: "Fresno skin education",
    caption:
      "Story prompt for a question box or poll: acne, texture, pigment, dryness, congestion, or prepping for an event. Use answers to guide follow-up stories and consult CTAs.",
    cta: "Reply to the story.",
    hashtags: ["#FresnoSkin", "#SkinTips", "#NCSAesthetics"],
  },
  {
    dayOffset: 4,
    hour: 10,
    minute: 30,
    title: "First Hydrafacial? Here’s what happens in 75 minutes.",
    format: "reel",
    pillar: "Hydrafacial authority",
    caption:
      "First-time clients usually want to know what actually happens during a Hydrafacial. This walkthrough is designed to show the treatment flow, what we look for during consult, and how we choose the right booster support for your skin. Results vary, and a consult helps us choose the best fit.",
    cta: "Book free consult.",
    hashtags: ["#Hydrafacial", "#FresnoFacials", "#FresnoHydrafacial", "#NCSAesthetics"],
  },
  {
    dayOffset: 5,
    hour: 8,
    minute: 30,
    title: "This week’s openings",
    format: "image",
    pillar: "Offers and availability",
    caption:
      "Need a weekday glow reset, waxing appointment, or lash and brow maintenance slot? Share this week’s openings with a clear booking CTA and a short note that times can change quickly.",
    cta: "Tap booking link.",
    hashtags: ["#FresnoBeauty", "#BookNow", "#GlossGenius", "#NCSAesthetics"],
  },
  {
    dayOffset: 6,
    hour: 12,
    minute: 0,
    title: "What is Circadia?",
    format: "carousel",
    pillar: "Circadia Pro Skin Systems",
    caption:
      "You’ve seen “Circadia Pro” in my bio — here’s what that means.\n\nCircadia is a professional skincare line built around the skin’s natural rhythms: protect during the day, repair at night.\n\nAt NCS Aesthetics, Circadia helps me customize facials, support your skin barrier, prep for peels, and build routines that actually make sense for your skin.\n\nYour skin does not need random products. It needs a plan.",
    cta: "Book a free consult.",
    hashtags: ["#CircadiaPro", "#ProfessionalSkincare", "#HomecareEducation", "#NCSAesthetics"],
  },
  {
    dayOffset: 7,
    hour: 15,
    minute: 0,
    title: "Custom facial explainer",
    format: "reel",
    pillar: "Circadia Pro Skin Systems",
    caption:
      "A custom facial means I choose products based on your skin that day.\n\nYour skin can change with weather, stress, hormones, products, travel, and lifestyle.\n\nThat’s why a custom facial is not one-size-fits-all. During your appointment, I look at your skin goals, current routine, sensitivity, congestion, dryness, texture, and barrier health before choosing the products and steps that make the most sense.",
    cta: "Book the NCS Custom Facial.",
    hashtags: ["#CustomFacial", "#CircadiaPro", "#BarrierSupport", "#NCSAesthetics"],
  },
  {
    dayOffset: 8,
    hour: 9,
    minute: 0,
    title: "Which Hydrafacial should you book?",
    format: "carousel",
    pillar: "Hydrafacial authority",
    caption:
      "Every skin goal does not need the same treatment. Here is the simple breakdown so you can book with confidence.\n\nExpress Hydrafacial: quick glow.\nHydrafacial: full treatment plus booster support.\nPlatinum Hydrafacial: elevated treatment with lymphatic and extra support.\n\nStill unsure? Book a free consult.",
    cta: "Tap the booking link.",
    hashtags: ["#HydrafacialAuthority", "#FresnoHydrafacial", "#NCSAesthetics", "#NorthFresno"],
  },
  {
    dayOffset: 9,
    hour: 12,
    minute: 0,
    title: "The gunkie is satisfying, but the glow is the point.",
    format: "reel",
    pillar: "Hydrafacial authority",
    caption:
      "Yes, the extraction jar is satisfying. But the real goal is skin that feels cleaner, smoother, and more supported over time.\n\nHydrafacial is designed to help with congestion, texture, and pre-event prep while fitting into a maintenance plan. Results vary.",
    cta: "Book Hydrafacial.",
    hashtags: ["#HydrafacialResults", "#FresnoHydrafacial", "#NCSAesthetics", "#CentralValleySkin"],
  },
  {
    dayOffset: 10,
    hour: 13,
    minute: 30,
    title: "Appointment countdown + question box",
    format: "story",
    pillar: "Offers and availability",
    caption:
      "Story prompt for openings, countdown stickers, and a Q&A box. Use it to gather objections before turning answers into reels or consult reminders.",
    cta: "Ask a question.",
    hashtags: ["#StoryPrompt", "#FresnoBeauty", "#NCSAesthetics"],
  },
  {
    dayOffset: 11,
    hour: 10,
    minute: 0,
    title: "Lash lift with tint",
    format: "reel",
    pillar: "Lashes and brows",
    caption:
      "For the girls who want lashes without daily mascara.\n\nA lash lift with tint gives your natural lashes a lifted, darker, more polished look without extensions.\n\nGreat for:\n- Busy mornings\n- Vacations\n- Low-maintenance beauty\n- Natural lash enhancement\n\nBook your lash lift through the link in bio.",
    cta: "Book lash lift.",
    hashtags: ["#FresnoLashLift", "#LashLift", "#LowMaintenanceBeauty", "#NCSAesthetics"],
  },
  {
    dayOffset: 12,
    hour: 15,
    minute: 0,
    title: "Skincare should feel personal, not rushed.",
    format: "image",
    pillar: "Proof and personality",
    caption:
      "One thing clients mention often: feeling comfortable, heard, and educated during their appointment.\n\nThat is the goal every time — a treatment plan that makes sense for your skin, your routine, and your comfort level.\n\nClient reviews should only be posted with permission.",
    cta: "Book with confidence.",
    hashtags: ["#ClientExperience", "#FresnoEsthetician", "#NCSAesthetics", "#LaDamaSalon"],
  },
  {
    dayOffset: 13,
    hour: 9,
    minute: 30,
    title: "Protect by day, repair by night",
    format: "carousel",
    pillar: "Circadia Pro Skin Systems",
    caption:
      "Your morning and night routines should not do the same job.\n\nMorning skincare is about protection: SPF, antioxidants, barrier support, and defending your skin from Fresno sun, heat, and daily exposure.\n\nNight skincare is about repair: cleansing, hydration, corrective ingredients, and giving your skin what it needs while you sleep.\n\nThis is one of the reasons I love Circadia — the line is built around working with your skin’s natural rhythm.",
    cta: "Save this and book a custom facial.",
    hashtags: ["#ProtectByDay", "#RepairByNight", "#CircadiaPro", "#NCSAesthetics"],
  },
  {
    dayOffset: 14,
    hour: 11,
    minute: 0,
    title: "Sensitive skin / barrier support",
    format: "reel",
    pillar: "Circadia Pro Skin Systems",
    caption:
      "If your skin is red, reactive, or irritated, more exfoliation may not be the answer.\n\nSometimes the best facial is not the strongest facial.\n\nReactive skin often needs calming, hydration, barrier support, and a slower plan before jumping into stronger treatments.\n\nIf your skin burns, flushes, feels tight, or reacts to everything, start with a consult so we can choose the right approach.",
    cta: "Book a free consult.",
    hashtags: ["#BarrierSupport", "#SensitiveSkin", "#CircadiaPro", "#NCSAesthetics"],
  },
  {
    dayOffset: 15,
    hour: 9,
    minute: 30,
    title: "First Brazilian wax? Read this first.",
    format: "carousel",
    pillar: "Waxing comfort and prep",
    caption:
      "A smoother wax starts before the appointment.\n\nBefore your wax:\n- Let hair grow enough for removal\n- Avoid heavy exfoliation right before\n- Wear loose clothing\n- Skip lotions and oils the day of\n- Ask questions — comfort matters here\n\nBook your wax through the link in bio.",
    cta: "Book wax.",
    hashtags: ["#FresnoWaxing", "#BrazilianWaxPrep", "#ComfortFirst", "#NCSAesthetics"],
  },
  {
    dayOffset: 16,
    hour: 11,
    minute: 0,
    title: "Brow lamination",
    format: "reel",
    pillar: "Lashes and brows",
    caption:
      "Brows looking uneven, flat, or hard to style?\n\nBrow lamination helps redirect and smooth the brow hairs for a fuller, more lifted look.\n\nPerfect if you want brows that look more styled with less daily effort.",
    cta: "Book brows.",
    hashtags: ["#FresnoBrows", "#BrowLamination", "#MorningRoutine", "#NCSAesthetics"],
  },
  {
    dayOffset: 17,
    hour: 13,
    minute: 0,
    title: "Waxing myth quiz",
    format: "story",
    pillar: "Waxing comfort and prep",
    caption:
      "Story prompt for myth-busting: exfoliating too hard before a wax, tanning right after, and when to book before trips or events. Keep it educational and comfort-first.",
    cta: "Vote in the quiz.",
    hashtags: ["#WaxingTips", "#StoryPrompt", "#NCSAesthetics"],
  },
  {
    dayOffset: 18,
    hour: 10,
    minute: 0,
    title: "Hydraback",
    format: "reel",
    pillar: "Hydrafacial authority",
    caption:
      "Your back deserves skincare too.\n\nHydraback is great before weddings, vacations, photos, backless outfits, or anytime your back feels congested.\n\nThink of it like a Hydrafacial-style reset for an area that is hard to treat at home.",
    cta: "Book Hydraback.",
    hashtags: ["#Hydraback", "#EventPrep", "#FresnoSkincare", "#NCSAesthetics"],
  },
  {
    dayOffset: 19,
    hour: 14,
    minute: 0,
    title: "Not sure what to book? Start here.",
    format: "image",
    pillar: "Offers and availability",
    caption:
      "Your skin does not need a random facial. It needs a plan.\n\nBook a free consult and we’ll talk through your skin goals, current routine, lifestyle, and what treatment makes the most sense for you.\n\nGood for:\n- First-time clients\n- Acne concerns\n- Texture\n- Pigmentation\n- Sensitive skin\n- Choosing between facial options",
    cta: "Book free consult.",
    hashtags: ["#SkinConsult", "#FresnoFacials", "#NCSAesthetics", "#NorthFresno"],
  },
  {
    dayOffset: 20,
    hour: 11,
    minute: 0,
    title: "Why chemical peels require a consult",
    format: "carousel",
    pillar: "Circadia Pro Skin Systems",
    caption:
      "Why I require a consult before chemical peels.\n\nChemical peels can be amazing, but they need to be planned correctly.\n\nBefore booking a peel, we need to look at:\n- Your current routine\n- Recent sun exposure\n- Sensitivity\n- Acne medications or actives\n- Pigmentation concerns\n- Downtime expectations\n- Your ability to follow aftercare\n\nA peel should never be random. It should be part of a plan.",
    cta: "Book a consult first.",
    hashtags: ["#PeelEducation", "#ConsultFirst", "#CircadiaPro", "#NCSAesthetics"],
  },
  {
    dayOffset: 21,
    hour: 12,
    minute: 0,
    title: "Acne-prone skin",
    format: "reel",
    pillar: "Circadia Pro Skin Systems",
    caption:
      "Acne-prone skin still needs hydration and calming.\n\nA lot of acne-prone clients overdo it with harsh products, skipping moisturizer, or exfoliating too often.\n\nAt NCS, the goal is to support clearer-looking skin without wrecking your barrier.\n\nWe can build a plan with the right facial, homecare, extractions, LED, and consistency.",
    cta: "Book the Clarifying Acne Facial or a consult.",
    hashtags: ["#AcneSupport", "#BarrierSupport", "#CircadiaPro", "#NCSAesthetics"],
  },
  {
    dayOffset: 22,
    hour: 9,
    minute: 0,
    title: "Meet Natalie: what I look for during your skin consult.",
    format: "reel",
    pillar: "Proof and personality",
    caption:
      "Meet Natalie and walk through what happens during a skin consult.\n\nThe goal is to look at your skin, routine, goals, and timeline so we can choose a treatment designed to support you instead of guessing. Results vary, and we build from real-life habits.",
    cta: "Book free consult.",
    hashtags: ["#MeetNatalie", "#FresnoEsthetician", "#SkinConsult", "#NCSAesthetics"],
  },
  {
    dayOffset: 23,
    hour: 11,
    minute: 0,
    title: "Chemical peel season: what to know before booking.",
    format: "carousel",
    pillar: "Fresno skin education",
    caption:
      "Chemical peels are not one-size-fits-all.\n\nUse this post to explain why a consult matters, what aftercare looks like, and why some clients should start with a different treatment first.\n\nBook a consult so we can choose the right treatment.",
    cta: "Book consult.",
    hashtags: ["#ChemicalPeel", "#FresnoSkincare", "#ConsultFirst", "#NCSAesthetics"],
  },
  {
    dayOffset: 24,
    hour: 13,
    minute: 0,
    title: "This or that: acne, texture, pigment, or dryness?",
    format: "story",
    pillar: "Fresno skin education",
    caption:
      "Story prompt to gather audience pain points and route them to consult content, Hydrafacial education, or custom facial explanations.",
    cta: "Vote in stories.",
    hashtags: ["#SkinQuiz", "#StoryPrompt", "#NCSAesthetics"],
  },
  {
    dayOffset: 25,
    hour: 10,
    minute: 0,
    title: "Custom Facial vs Hydrafacial",
    format: "reel",
    pillar: "Hydrafacial authority",
    caption:
      "Custom Facial vs Hydrafacial: what is the difference?\n\nA custom facial can help when your skin needs a hands-on, tailored facial experience. A Hydrafacial is designed to deeply cleanse, exfoliate, extract, and hydrate in a more defined treatment flow.\n\nBook a consult so we can choose the right treatment.",
    cta: "Book the right service.",
    hashtags: ["#CustomFacial", "#Hydrafacial", "#FresnoFacials", "#NCSAesthetics"],
  },
  {
    dayOffset: 26,
    hour: 14,
    minute: 0,
    title: "Hydrafacial package reminder",
    format: "image",
    pillar: "Offers and availability",
    caption:
      "One facial is a glow. Consistency is a plan.\n\nHydrafacial packages are for clients who want to stay consistent with their skin instead of starting over every few months.\n\nBest for:\n- Monthly maintenance\n- Texture\n- Congestion\n- Event prep\n- Long-term glow goals\n\nIMPORTANT: Do not include package price until owner confirms the correct Platinum Hydrafacial B3G1 pricing.",
    cta: "Buy package or book consult.",
    hashtags: ["#HydrafacialPackage", "#MonthlyMaintenance", "#NCSAesthetics", "#FresnoHydrafacial"],
    requiresPriceVerification: true,
  },
  {
    dayOffset: 27,
    hour: 10,
    minute: 30,
    title: "Fresno summer skin routine",
    format: "carousel",
    pillar: "Circadia Pro Skin Systems",
    caption:
      "Fresno skin needs a different plan in summer.\n\nHeat, SPF, sweat, outdoor events, and pollution can leave your skin feeling congested, dull, or irritated.\n\nYour summer plan should focus on:\n- Proper cleansing\n- SPF reapplication\n- Hydration\n- Barrier support\n- Gentle exfoliation\n- Consistent monthly treatments\n\nThis is where Circadia homecare plus professional facials can help support your skin between appointments.",
    cta: "Book a custom facial.",
    hashtags: ["#CircadiaPro", "#HomecareEducation", "#BarrierSupport", "#NCSAesthetics"],
  },
  {
    dayOffset: 28,
    hour: 15,
    minute: 0,
    title: "Product education without pricing",
    format: "carousel",
    pillar: "Circadia Pro Skin Systems",
    caption:
      "Product education > random product buying.\n\nProfessional skincare works best when it is matched to your skin.\n\nInstead of guessing online, ask what actually fits your goals:\n- Congestion\n- Texture\n- Pigmentation\n- Dryness\n- Sensitivity\n- Acne-prone skin\n- Aging concerns\n\nI’ll help you understand what belongs in your routine and what does not.",
    cta: "Ask at your next appointment.",
    hashtags: ["#ProfessionalSkincare", "#CircadiaPro", "#HomecareEducation", "#NCSAesthetics"],
    requiresBrandAssetRights: true,
    hidePublicProductPricing: true,
  },
];

function getSeedStartDate(baseDate: Date): Date {
  const currentDay = baseDate.getDay();
  const daysUntilNextMonday = currentDay === 1 ? 0 : (8 - currentDay) % 7;
  return addDays(baseDate, daysUntilNextMonday);
}

export function buildSeedPosts(baseDate = new Date()): PostInsert[] {
  const timezone = appTimezone();
  const seedStart = getSeedStartDate(baseDate);

  return seedBlueprints.map((item) => {
    const scheduledLocal = set(addDays(seedStart, item.dayOffset - 1), {
      hours: item.hour,
      minutes: item.minute,
      seconds: 0,
      milliseconds: 0,
    });

    return {
      title: item.title,
      platform: "instagram",
      format: item.format,
      pillar: item.pillar,
      status: "draft",
      caption: item.caption,
      hashtags: item.hashtags,
      cta: item.cta,
      scheduled_at: fromZonedTime(scheduledLocal, timezone).toISOString(),
      timezone,
      asset_ids: [],
      error: null,
      owner_approved: false,
      requires_price_verification: item.requiresPriceVerification ?? false,
      price_verified: false,
      requires_owner_service_confirmation:
        item.requiresOwnerServiceConfirmation ?? false,
      owner_service_confirmed: false,
      requires_brand_asset_rights: item.requiresBrandAssetRights ?? false,
      hide_public_product_pricing: item.hidePublicProductPricing ?? false,
    };
  });
}

export const seedTemplates: ContentTemplateInsert[] = [
  {
    service: "Hydrafacial",
    pillar: "Hydrafacial authority",
    hook: "Fresno heat + SPF + sweat = congested skin.",
    caption_template:
      "If your skin feels rough, dull, oily, or like your products are just sitting on top, it might be time for a Hydrafacial reset. This treatment is designed to deeply cleanse, exfoliate, extract, hydrate, and support your glow in one appointment. Results vary.",
    cta: "Book Hydrafacial.",
    hashtags: ["#FresnoHydrafacial", "#FresnoSkincare", "#NCSAesthetics"],
  },
  {
    service: "Free 30-minute consult",
    pillar: "Offers and availability",
    hook: "Not sure what to book? Start here.",
    caption_template:
      "Your skin does not need a random facial. It needs a plan. Book a free consult and we’ll talk through your skin goals, routine, lifestyle, and what treatment makes the most sense for you.",
    cta: "Book free consult.",
    hashtags: ["#SkinConsult", "#FresnoEsthetician", "#NCSAesthetics"],
  },
  {
    service: "Brazilian waxing",
    pillar: "Waxing comfort and prep",
    hook: "First Brazilian wax? Read this first.",
    caption_template:
      "A smoother wax starts before the appointment. Let hair grow enough for removal, avoid heavy exfoliation right before, wear loose clothing, skip lotions and oils the day of, and ask questions because comfort matters here.",
    cta: "Book wax.",
    hashtags: ["#FresnoWaxing", "#BrazilianWaxPrep", "#NCSAesthetics"],
  },
  {
    service: "Lash lift with tint",
    pillar: "Lashes and brows",
    hook: "For the girls who want lashes without daily mascara.",
    caption_template:
      "A lash lift with tint gives your natural lashes a lifted, darker, more polished look without extensions. Great for busy mornings, vacations, low-maintenance beauty, and natural lash enhancement.",
    cta: "Book lash lift.",
    hashtags: ["#FresnoLashLift", "#LashLift", "#NCSAesthetics"],
  },
  {
    service: "Circadia Pro Skin Systems",
    pillar: "Circadia Pro Skin Systems",
    hook: "You’ve seen Circadia Pro in my bio. Here’s what that means.",
    caption_template:
      "Circadia is a professional skincare line built around the skin’s natural rhythms: protect during the day, repair at night. At NCS Aesthetics, Circadia helps me customize facials, support your barrier, prep for peels, and build routines that actually make sense for your skin. Results vary.",
    cta: "Book a free consult.",
    hashtags: ["#Circadia", "#CircadiaPro", "#ProfessionalSkincare", "#NCSAesthetics"],
  },
  {
    service: "Custom Facial",
    pillar: "Circadia Pro Skin Systems",
    hook: "A custom facial means I choose products based on your skin that day.",
    caption_template:
      "Your skin can change with weather, stress, hormones, products, travel, and lifestyle. That is why a custom facial is not one-size-fits-all. I look at your goals, routine, sensitivity, congestion, dryness, texture, and barrier health before choosing what makes the most sense. Results vary.",
    cta: "Book the NCS Custom Facial.",
    hashtags: ["#CustomFacial", "#CircadiaPro", "#BarrierSupport", "#NCSAesthetics"],
  },
  {
    service: "Chemical peel consult",
    pillar: "Circadia Pro Skin Systems",
    hook: "Why I require a consult before chemical peels.",
    caption_template:
      "Chemical peels can be amazing, but they need to be planned correctly. Before booking a peel, we need to look at your routine, sun exposure, sensitivity, active ingredients, pigmentation concerns, downtime expectations, and aftercare. A peel should never be random. It should be part of a plan.",
    cta: "Book a consult first.",
    hashtags: ["#PeelEducation", "#ConsultFirst", "#CircadiaPro", "#NCSAesthetics"],
  },
  {
    service: "Circadia homecare education",
    pillar: "Circadia Pro Skin Systems",
    hook: "Product education > random product buying.",
    caption_template:
      "Professional skincare works best when it is matched to your skin. Instead of guessing online, ask what actually fits your goals and what belongs in your routine. Do not show public retail pricing. Use official Circadia assets only with permission and confirmed usage rights.",
    cta: "Ask at your next appointment.",
    hashtags: circadiaTags,
  },
];
