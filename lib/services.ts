import type { LandingContent } from "@/lib/content";

/* URL slug → key under `services` in content/landing.json. Order = display order. */
export const SERVICE_ROUTES = [
  { slug: "ra-compliance", key: "raCompliance" },
  { slug: "equity-swing-trading", key: "swingTrading" },
  { slug: "option-selling", key: "optionSelling" },
  { slug: "option-buying", key: "optionBuying" },
] as const;

export type ServiceKey = (typeof SERVICE_ROUTES)[number]["key"];
export type ServiceContent = LandingContent["services"][ServiceKey];
