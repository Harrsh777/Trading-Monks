import { promises as fs } from "node:fs";
import path from "node:path";
import { DEFAULT_CONTENT, sanitizeContent, type LandingContent } from "@/lib/content";

/*
 * Content lives in content/landing.json — no database.
 *
 * Locally the file is read and written directly. On Vercel the filesystem is
 * read-only, so when GITHUB_TOKEN is set the file is read from, and committed
 * to, the GitHub repository instead. Each commit also triggers a redeploy, so
 * the bundled copy catches up too.
 */

const CONTENT_PATH = "content/landing.json";

function github() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;
  return {
    token,
    branch: process.env.GITHUB_BRANCH || "main",
    url: `https://api.github.com/repos/${repo}/contents/${CONTENT_PATH}`,
  };
}

function githubHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "trading-monks-admin",
  };
}

async function readFromGitHub(gh: NonNullable<ReturnType<typeof github>>) {
  const response = await fetch(`${gh.url}?ref=${encodeURIComponent(gh.branch)}`, {
    headers: githubHeaders(gh.token),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`GitHub read failed (${response.status}): ${await response.text()}`);
  }
  const file = (await response.json()) as { content: string; sha: string };
  const json = Buffer.from(file.content, "base64").toString("utf8");
  return { content: JSON.parse(json) as unknown, sha: file.sha };
}

export async function readContent(): Promise<LandingContent> {
  const gh = github();
  if (gh) {
    try {
      return sanitizeContent((await readFromGitHub(gh)).content);
    } catch (error) {
      console.error("[content] Falling back to bundled content:", error);
      return DEFAULT_CONTENT;
    }
  }

  if (process.env.NODE_ENV === "development") {
    try {
      const raw = await fs.readFile(path.join(process.cwd(), CONTENT_PATH), "utf8");
      return sanitizeContent(JSON.parse(raw));
    } catch (error) {
      console.error("[content] Could not read local content file:", error);
    }
  }

  return DEFAULT_CONTENT;
}

export async function writeContent(content: LandingContent): Promise<void> {
  const json = `${JSON.stringify(content, null, 2)}\n`;
  const gh = github();

  if (gh) {
    const { sha } = await readFromGitHub(gh);
    const response = await fetch(gh.url, {
      method: "PUT",
      headers: { ...githubHeaders(gh.token), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `content: update landing page via admin (${new Date().toISOString()})`,
        content: Buffer.from(json, "utf8").toString("base64"),
        sha,
        branch: gh.branch,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`GitHub save failed (${response.status}): ${await response.text()}`);
    }
    return;
  }

  if (process.env.NODE_ENV === "development") {
    await fs.writeFile(path.join(process.cwd(), CONTENT_PATH), json, "utf8");
    return;
  }

  throw new Error(
    "Saving is not configured. Set GITHUB_TOKEN and GITHUB_REPO in the Vercel environment variables.",
  );
}
