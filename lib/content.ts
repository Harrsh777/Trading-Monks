import defaults from "@/content/landing.json";

/* Every editable string on the landing page. The JSON file is the schema. */
export type LandingContent = typeof defaults;

export const DEFAULT_CONTENT: LandingContent = defaults;

export const CONTENT_TAG = "landing-content";

/*
 * Lists whose length is tied to the page's animation or chart geometry
 * (candle highlights, the five-stage timeline, seal lenses…). Their items can
 * be edited but not added or removed.
 */
export const FIXED_LENGTH_LISTS = new Set([
  "market.concepts",
  "philosophy.principles",
  "strategy.stages",
  "governance.stats",
  "governance.lenses",
]);

const MAX_STRING = 5000;
const MAX_LIST = 60;

/*
 * Coerces untrusted input into the shape of the template: unknown keys are
 * dropped, missing or mistyped values fall back to the defaults. Used both
 * to validate admin saves and to read stored content written by an older
 * version of the schema.
 */
export function sanitizeContent(input: unknown): LandingContent {
  return coerce(input, DEFAULT_CONTENT, "") as LandingContent;
}

function coerce(value: unknown, template: unknown, path: string): unknown {
  if (Array.isArray(template)) {
    const fallbackItem = template[0];
    const list = Array.isArray(value) ? value : template;
    if (FIXED_LENGTH_LISTS.has(path)) {
      return template.map((item, i) => coerce(list[i], item, `${path}[]`));
    }
    return list.slice(0, MAX_LIST).map((item, i) => coerce(item, template[i] ?? fallbackItem, `${path}[]`));
  }

  if (template !== null && typeof template === "object") {
    const source = value !== null && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
    return Object.fromEntries(
      Object.entries(template).map(([key, item]) => [
        key,
        coerce(source[key], item, path ? `${path}.${key}` : key),
      ]),
    );
  }

  if (typeof template === "string") {
    return typeof value === "string" ? value.slice(0, MAX_STRING) : template;
  }
  if (typeof template === "number") {
    const n = typeof value === "string" ? Number(value) : value;
    return typeof n === "number" && Number.isFinite(n) ? n : template;
  }
  if (typeof template === "boolean") {
    return typeof value === "boolean" ? value : template;
  }
  return template;
}
