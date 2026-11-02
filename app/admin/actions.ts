"use server";

import { refresh, updateTag } from "next/cache";
import { checkPassword, createSession, destroySession, isAdmin } from "@/lib/admin-auth";
import { CONTENT_TAG, sanitizeContent } from "@/lib/content";
import { writeContent } from "@/lib/content-store";

export type LoginState = { error?: string };
export type SaveResult = { ok: boolean; message: string };

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    /* Slow down guessing */
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "Incorrect password." };
  }
  await createSession();
  refresh();
  return {};
}

export async function logout() {
  await destroySession();
  refresh();
}

export async function saveContent(input: unknown): Promise<SaveResult> {
  if (!(await isAdmin())) {
    return { ok: false, message: "Your session has expired. Please log in again." };
  }

  try {
    await writeContent(sanitizeContent(input));
    updateTag(CONTENT_TAG);
    return {
      ok: true,
      message: process.env.GITHUB_TOKEN && process.env.GITHUB_REPO
        ? "Saved and committed to GitHub. The live site will show the change within a minute or two."
        : "Saved to content/landing.json.",
    };
  } catch (error) {
    console.error("[admin] Save failed:", error);
    return { ok: false, message: error instanceof Error ? error.message : "Save failed." };
  }
}
