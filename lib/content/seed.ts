import { addDays, set } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import { appTimezone } from "@/lib/env";
import type { ContentTemplateInsert, PostFormat, PostInsert } from "@/types/database";

type SeedPostBlueprint = {
  dayOffset: number;
  title: string;
  format: PostFormat;
  pillar: string;
  caption: string;
  cta: string;
  hashtags: string[];
};

const seedBlueprints: SeedPostBlueprint[] = [
  {
    dayOffset: 1,
    title: "Fresno heat, SPF, and sweat can clog the vibe",
    format: "reel",
    pillar: "seasonal education",
    caption:
      "Fresno heat, sweat, and layers of SPF can leave skin feeling heavy by the end of the day. A Hydrafacial is designed to deeply cleanse, exfoliate, and refresh skin when your routine needs a reset. Results vary, and we always tailor the service to your skin goals.",
    cta: "Book your Hydrafacial.",
    hashtags: ["#NCSAesthetics", "#FresnoSkin", "#Hydrafacial", "#FresnoFacial"],
  },
  {
    dayOffset: 3,
    title: "SPF reapplication rules for Fresno days",
    format: "carousel",
    pillar: "education",
    caption:
      "SPF works best when it is part of a routine, not a one-time step. This carousel walks through simple reapplication reminders for errands, workouts, and long Fresno afternoons. Daily consistency can help support skin that looks and feels more balanced.",
    cta: "Save this for your next sunny day.",
    hashtags: ["#SPFTips", "#FresnoAesthetics", "#SkinEducation", "#NCSAesthetics"],
  },
  {
    dayOffset: 5,
    title: "Your first Hydrafacial appointment",
    format: "reel",
    pillar: "service walkthrough",
    caption:
      "Curious what your first Hydrafacial visit looks like? We walk through consultation, skin goals, treatment steps, and aftercare so you know exactly what to expect. Every appointment is customized, and results vary based on your skin and routine.",
    cta: "Book a free consult.",
    hashtags: ["#HydrafacialJourney", "#FresnoEsthetician", "#SkinConsult", "#NCSAesthetics"],
  },
  {
    dayOffset: 7,
    title: "Appointment openings this week",
    format: "image",
    pillar: "availability",
    caption:
      "Fresh openings just dropped for skin, lashes, brows, and waxing appointments. If you have been waiting for a weekday reset or pre-event appointment, this is a good time to grab a spot.",
    cta: "Tap the booking link to claim your time.",
    hashtags: ["#FresnoAppointments", "#BookNow", "#NCSAesthetics", "#GlossGenius"],
  },
  {
    dayOffset: 9,
    title: "Express vs Hydrafacial vs Platinum",
    format: "carousel",
    pillar: "service education",
    caption:
      "Not sure which Hydrafacial option fits your day and skin goals? This comparison breaks down the pacing and support each option is designed to offer. The best fit depends on your skin needs, timing, and desired experience.",
    cta: "Book the service that fits you best.",
    hashtags: ["#HydrafacialFresno", "#SkincareChoices", "#NCSAesthetics", "#FresnoBeauty"],
  },
  {
    dayOffset: 11,
    title: "Hydrafacial extraction content",
    format: "reel",
    pillar: "proof of work",
    caption:
      "The satisfying part everyone asks about. Hydrafacial extractions can help lift away buildup while supporting a cleaner-feeling complexion. Treatment plans are customized, and results vary from person to person.",
    cta: "Book your Hydrafacial.",
    hashtags: ["#Gunkie", "#ExtractionReel", "#HydrafacialResults", "#NCSAesthetics"],
  },
  {
    dayOffset: 13,
    title: "Lash lift with tint results",
    format: "reel",
    pillar: "service spotlight",
    caption:
      "A lash lift with tint is designed to give natural lashes a more lifted, defined look without daily mascara. This service can help simplify your routine while still feeling polished.",
    cta: "Book your lash lift.",
    hashtags: ["#LashLift", "#LashTint", "#FresnoLashes", "#NCSAesthetics"],
  },
  {
    dayOffset: 15,
    title: "Brazilian wax prep reminders",
    format: "carousel",
    pillar: "prep guide",
    caption:
      "The smoother your prep, the smoother your appointment. These reminders cover timing, exfoliation, and comfort tips so you can show up feeling ready and informed.",
    cta: "Book your wax.",
    hashtags: ["#BrazilianWaxPrep", "#FresnoWaxing", "#WaxTips", "#NCSAesthetics"],
  },
  {
    dayOffset: 17,
    title: "Client review spotlight graphic",
    format: "image",
    pillar: "testimonial",
    caption:
      "Kind words like these mean everything. We only share reviews with permission, and every experience is unique. Thank you for trusting NCS Aesthetics with your skin and self-care time.",
    cta: "Book with confidence.",
    hashtags: ["#ClientLove", "#FresnoEsthetics", "#NCSAesthetics", "#BeautyReview"],
  },
  {
    dayOffset: 19,
    title: "Teen acne facial expectations",
    format: "carousel",
    pillar: "consult education",
    caption:
      "A teen acne facial is designed to support clearer-feeling skin, better routine habits, and a more confident starting point. Progress takes consistency, home care matters, and results vary.",
    cta: "Book a consult.",
    hashtags: ["#TeenFacial", "#AcneSupport", "#FresnoSkinCare", "#NCSAesthetics"],
  },
  {
    dayOffset: 21,
    title: "Brow lamination transformation",
    format: "reel",
    pillar: "transformation",
    caption:
      "Brow lamination can help brows look fuller, smoother, and more intentionally shaped. This service is designed to give structure while still keeping the finish soft and wearable.",
    cta: "Book your brow appointment.",
    hashtags: ["#BrowLamination", "#FresnoBrows", "#BrowTransformation", "#NCSAesthetics"],
  },
  {
    dayOffset: 23,
    title: "Hydraback for summer and events",
    format: "reel",
    pillar: "seasonal spotlight",
    caption:
      "Back care deserves the same attention as face care, especially during event season. Hydraback is designed to deeply cleanse and refresh hard-to-reach skin so you can feel more ready for open-back looks.",
    cta: "Book Hydraback.",
    hashtags: ["#Hydraback", "#SummerSkin", "#EventPrep", "#NCSAesthetics"],
  },
  {
    dayOffset: 25,
    title: "Meet Natalie and the consult process",
    format: "reel",
    pillar: "founder story",
    caption:
      "Meet Natalie and take a look at how a skin consult works at NCS Aesthetics. We focus on listening first, building a realistic plan, and recommending services designed to support your goals over time.",
    cta: "Book your free consult.",
    hashtags: ["#MeetYourEsthetician", "#FresnoBusiness", "#SkinConsult", "#NCSAesthetics"],
  },
  {
    dayOffset: 27,
    title: "Chemical peel consult requirements",
    format: "carousel",
    pillar: "consult education",
    caption:
      "Chemical peels are not one-size-fits-all. This post covers why a consult matters, what we review first, and how we decide whether a peel is the right next step for your skin.",
    cta: "Book a consult first.",
    hashtags: ["#ChemicalPeel", "#SkinConsultation", "#FresnoFacials", "#NCSAesthetics"],
  },
  {
    dayOffset: 29,
    title: "Custom Facial vs Hydrafacial",
    format: "reel",
    pillar: "service education",
    caption:
      "Custom facials and Hydrafacials can support different goals. This reel breaks down how they differ in feel, pacing, and focus so it is easier to choose the right appointment.",
    cta: "Book the right service for your goals.",
    hashtags: ["#CustomFacial", "#Hydrafacial", "#FresnoSkinStudio", "#NCSAesthetics"],
  },
  {
    dayOffset: 30,
    title: "Hydrafacial package reminder",
    format: "image",
    pillar: "offer reminder",
    caption:
      "Hydrafacial packages are available, and details will be shared once the owner confirms the final offer information. Until then, we are keeping package pricing off the feed and focusing on the treatment benefits.",
    cta: "Ask about packages after pricing is confirmed.",
    hashtags: ["#HydrafacialPackage", "#FresnoBeautyBusiness", "#NCSAesthetics", "#SkinMembership"],
  },
];

export function buildSeedPosts(baseDate = new Date()): PostInsert[] {
  const timezone = appTimezone();

  return seedBlueprints.map((item) => {
    const scheduledLocal = set(addDays(baseDate, item.dayOffset), {
      hours: 10,
      minutes: 30,
      seconds: 0,
      milliseconds: 0,
    });

    return {
      title: item.title,
      platform: "instagram",
      format: item.format,
      pillar: item.pillar,
      status: "approved",
      caption: item.caption,
      hashtags: item.hashtags,
      cta: item.cta,
      scheduled_at: fromZonedTime(scheduledLocal, timezone).toISOString(),
      timezone,
      asset_ids: [],
      error: null,
    };
  });
}

export const seedTemplates: ContentTemplateInsert[] = [
  {
    service: "Hydrafacial",
    pillar: "service education",
    hook: "What does a Hydrafacial actually do?",
    caption_template:
      "Hydrafacial is designed to deeply cleanse, exfoliate, and refresh skin while supporting a smoother-looking finish. We tailor every treatment to the client's skin goals, and results vary.",
    cta: "Book your Hydrafacial.",
    hashtags: ["#Hydrafacial", "#NCSAesthetics", "#FresnoSkin"],
  },
  {
    service: "Free 30-minute consult",
    pillar: "consult education",
    hook: "Not sure where to start?",
    caption_template:
      "A consult gives us space to talk through your skin goals, routine, and service options before you commit. It is designed to make the next step feel clear and personalized.",
    cta: "Book your free consult.",
    hashtags: ["#SkinConsult", "#FresnoEsthetician", "#NCSAesthetics"],
  },
  {
    service: "Brazilian waxing",
    pillar: "prep guide",
    hook: "Wax day goes better with prep.",
    caption_template:
      "A little prep can help make your appointment smoother and more comfortable. We walk you through timing, aftercare, and what to expect before you arrive.",
    cta: "Book your waxing appointment.",
    hashtags: ["#BrazilianWax", "#WaxPrep", "#NCSAesthetics"],
  },
  {
    service: "Lash lift with tint",
    pillar: "service spotlight",
    hook: "Wake up with lashes that already look done.",
    caption_template:
      "A lash lift with tint is designed to give natural lashes a more lifted and defined look without extra daily steps. It can help simplify your beauty routine while keeping things natural.",
    cta: "Book your lash lift.",
    hashtags: ["#LashLift", "#LashTint", "#NCSAesthetics"],
  },
];
