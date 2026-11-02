import type { Metadata } from "next";
import { Suspense } from "react";
import { isAdmin } from "@/lib/admin-auth";
import { readContent } from "@/lib/content-store";
import Dashboard from "./dashboard";
import LoginForm from "./login-form";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin · Trading Monks",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="adm-login"><p className="adm-hint">Loading…</p></div>}>
      <AdminGate />
    </Suspense>
  );
}

async function AdminGate() {
  if (!(await isAdmin())) return <LoginForm />;

  /* Read fresh, bypassing the public page cache, so edits never start from stale copy */
  const content = await readContent();
  const storage = process.env.GITHUB_TOKEN && process.env.GITHUB_REPO
    ? "github"
    : process.env.NODE_ENV === "development"
      ? "local"
      : "none";

  return <Dashboard initialContent={content} storage={storage} />;
}
