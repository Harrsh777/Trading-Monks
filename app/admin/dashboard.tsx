"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import type { LandingContent } from "@/lib/content";
import { logout, saveContent } from "./actions";
import { SECTIONS, type Block, type Field } from "./sections";

type Json = unknown;
type Toast = { ok: boolean; message: string } | null;

/* ---- immutable path helpers ------------------------------------------- */

function getIn(source: Json, path: (string | number)[]): Json {
  return path.reduce<Json>(
    (value, key) => (value as Record<string | number, Json> | undefined)?.[key],
    source,
  );
}

function setIn(source: Json, path: (string | number)[], next: Json): Json {
  if (path.length === 0) return next;
  const [key, ...rest] = path;
  const child = setIn((source as Record<string | number, Json>)[key], rest, next);
  if (Array.isArray(source)) {
    const copy = [...source];
    copy[key as number] = child;
    return copy;
  }
  return { ...(source as Record<string, Json>), [key]: child };
}

const splitPath = (path: string) => path.split(".");

/* ---- dashboard ---------------------------------------------------------- */

export default function Dashboard({
  initialContent,
  storage,
}: {
  initialContent: LandingContent;
  storage: "github" | "local" | "none";
}) {
  const [content, setContent] = useState<LandingContent>(initialContent);
  const [saved, setSaved] = useState<LandingContent>(initialContent);
  const [active, setActive] = useState(SECTIONS[0].id);
  const [toast, setToast] = useState<Toast>(null);
  const [pending, startTransition] = useTransition();

  const dirty = JSON.stringify(content) !== JSON.stringify(saved);
  const section = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  const update = (path: (string | number)[], value: Json) =>
    setContent((current) => setIn(current, path, value) as LandingContent);

  function save() {
    if (pending) return;
    startTransition(async () => {
      const result = await saveContent(content);
      setToast(result);
      if (result.ok) setSaved(content);
    });
  }

  /* Ctrl/Cmd + S saves */
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        save();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* Warn before leaving with unsaved edits */
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (!toast?.ok) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="adm-shell">
      <aside className="adm-sidebar">
        <div className="adm-brand">
          TRADING<span>MONKS</span>
          <small>Content admin</small>
        </div>
        <nav className="adm-nav" aria-label="Sections">
          {SECTIONS.map((s) => (
            <button
              type="button"
              key={s.id}
              className={s.id === active ? "is-active" : ""}
              onClick={() => {
                setActive(s.id);
                window.scrollTo({ top: 0 });
              }}
            >
              {s.title}
            </button>
          ))}
        </nav>
        <div className="adm-sidebar-foot">
          <a href="/" target="_blank" rel="noopener noreferrer" className="adm-link">
            View live site ↗
          </a>
          <form action={logout}>
            <button type="submit" className="adm-link">Log out</button>
          </form>
        </div>
      </aside>

      <main className="adm-main">
        <header className="adm-topbar">
          <div>
            <h1>{section.title}</h1>
            <p>{section.description}</p>
          </div>
          <div className="adm-actions">
            {dirty && <span className="adm-dirty">Unsaved changes</span>}
            <button
              type="button"
              className="adm-btn adm-btn-ghost"
              disabled={!dirty || pending}
              onClick={() => {
                if (confirm("Discard all unsaved changes?")) setContent(saved);
              }}
            >
              Discard
            </button>
            <button
              type="button"
              className="adm-btn"
              disabled={!dirty || pending}
              onClick={save}
              title="Ctrl + S"
            >
              {pending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </header>

        {storage === "none" && (
          <div className="adm-banner is-error">
            Saving is not configured on this deployment. Add <code>GITHUB_TOKEN</code> and{" "}
            <code>GITHUB_REPO</code> to the environment variables.
          </div>
        )}

        {toast && (
          <div className={`adm-banner ${toast.ok ? "is-ok" : "is-error"}`} role="status">
            <span>{toast.message}</span>
            <button type="button" aria-label="Dismiss" onClick={() => setToast(null)}>×</button>
          </div>
        )}

        <div className="adm-blocks">
          {section.blocks.map((block, i) => (
            <BlockEditor key={`${section.id}-${i}`} block={block} content={content} update={update} />
          ))}
        </div>
      </main>
    </div>
  );
}

/* ---- blocks ------------------------------------------------------------- */

type Update = (path: (string | number)[], value: Json) => void;

function BlockEditor({ block, content, update }: { block: Block; content: LandingContent; update: Update }) {
  const base = splitPath(block.path);

  if (block.kind === "fields") {
    return (
      <Card title={block.title}>
        <div className="adm-grid">
          {block.fields.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={getIn(content, [...base, field.key])}
              onChange={(value) => update([...base, field.key], value)}
            />
          ))}
        </div>
      </Card>
    );
  }

  const items = (getIn(content, base) as Json[]) ?? [];
  const move = (from: number, to: number) => {
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    update(base, next);
  };

  return (
    <Card
      title={`${block.title} (${items.length})`}
      hint={block.hint}
      action={
        !block.fixed && (
          <button
            type="button"
            className="adm-btn adm-btn-small"
            onClick={() => update(base, [...items, structuredClone(block.newItem)])}
          >
            + Add {block.itemName}
          </button>
        )
      }
    >
      {items.length === 0 && <p className="adm-empty">No {block.itemName}s yet.</p>}
      <ol className="adm-list">
        {items.map((item, index) => {
          const summary = block.fields
            ? String((item as Record<string, Json>)[block.summaryKey ?? block.fields[0].key] ?? "")
            : String(item);
          return (
            <li key={index} className="adm-item">
              <div className="adm-item-head">
                <span className="adm-item-index">{String(index + 1).padStart(2, "0")}</span>
                {block.fields ? (
                  <strong className="adm-item-title">{summary || `Untitled ${block.itemName}`}</strong>
                ) : (
                  <input
                    className="adm-input adm-item-inline"
                    value={String(item ?? "")}
                    aria-label={`${block.itemName} ${index + 1}`}
                    onChange={(event) => update([...base, index], event.target.value)}
                  />
                )}
                {!block.fixed && (
                  <div className="adm-item-tools">
                    <button
                      type="button"
                      aria-label="Move up"
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      disabled={index === items.length - 1}
                      onClick={() => move(index, index + 1)}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${block.itemName}`}
                      className="is-danger"
                      onClick={() => {
                        if (confirm(`Delete this ${block.itemName}${summary ? ` ("${summary}")` : ""}?`)) {
                          update(base, items.filter((_, i) => i !== index));
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              {block.fields && (
                <div className="adm-grid">
                  {block.fields.map((field) => (
                    <FieldInput
                      key={field.key}
                      field={field}
                      value={(item as Record<string, Json>)[field.key]}
                      onChange={(value) => update([...base, index, field.key], value)}
                    />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function Card({
  title,
  hint,
  action,
  children,
}: {
  title?: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="adm-card">
      {(title || action) && (
        <div className="adm-card-head">
          <div>
            {title && <h2>{title}</h2>}
            {hint && <p className="adm-hint">{hint}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: Json; onChange: (value: Json) => void }) {
  const type = field.type ?? "text";
  const wide = type === "textarea" || type === "image";

  let input: ReactNode;
  if (type === "boolean") {
    input = (
      <label className="adm-check">
        <input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />
        <span>{field.label}</span>
      </label>
    );
  } else if (type === "textarea") {
    input = (
      <textarea
        className="adm-input"
        rows={Math.min(10, Math.max(3, Math.ceil(String(value ?? "").length / 90)))}
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  } else if (type === "number") {
    input = (
      <input
        className="adm-input"
        type="number"
        value={Number(value ?? 0)}
        onChange={(event) => onChange(event.target.value === "" ? 0 : Number(event.target.value))}
      />
    );
  } else {
    input = (
      <div className={type === "image" ? "adm-image-row" : undefined}>
        {type === "image" && (
          <span className="adm-avatar" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {value ? <img src={String(value)} alt="" /> : "?"}
          </span>
        )}
        <input
          className="adm-input"
          type={type === "text" ? "text" : "url"}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }

  return (
    <div className={`adm-field ${wide ? "is-wide" : ""}`}>
      {type === "boolean" ? input : (
        <label>
          <span className="adm-label">{field.label}</span>
          {input}
        </label>
      )}
      {field.hint && <p className="adm-hint">{field.hint}</p>}
    </div>
  );
}
