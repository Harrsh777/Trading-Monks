import { cacheTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/content";
import { readContent } from "@/lib/content-store";

/* Cached read for the public page — invalidated by the admin save action. */
export async function getContent() {
  "use cache";
  cacheTag(CONTENT_TAG);
  return readContent();
}
