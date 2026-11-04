"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Arrow,
  Brand,
  ContactForm,
  ContentContext,
  CurrentYear,
  Emblem,
  Eyebrow,
  MagneticLink,
  Rich,
  useContent,
} from "../landing-page";
import type { LandingContent } from "@/lib/content";
import { SERVICE_ROUTES, type ServiceKey } from "@/lib/services";
import "../page.css";
import "./services.css";

/* Hash links point at landing-page sections; on these pages they need the home path */
const siteHref = (href: string) => (href.startsWith("#") ? `/${href}` : href);

/* -------------------------------------------------------------------------- */
/* Shell — header, footer, cursor, scroll progress and reveal choreography     */
/* -------------------------------------------------------------------------- */

function SiteShell({ current, variant, children }: { current: string; variant: string; children: ReactNode }) {
  const { contact, nav, footer } = useContent();
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);

  /* Scroll choreography */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();

    const context = gsap.context(() => {
      if (motionPaused) return;
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".tm-scroll-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.2 },
        });

        gsap.utils.toArray<HTMLElement>(".tm-reveal", root).forEach((el) => {
          gsap.from(el, {
            y: 34,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>(".sv-stagger", root).forEach((group) => {
          gsap.from(group.children, {
            y: 40,
            opacity: 0,
            duration: 0.85,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>(".sv-process", root).forEach((track) => {
          gsap.fromTo(
            track.querySelector(".sv-process-line"),
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { trigger: track, start: "top 80%", end: "bottom 55%", scrub: 0.4 },
            },
          );
        });

        gsap.to(".sv-hero-emblem", {
          yPercent: 18,
          rotate: 6,
          ease: "none",
          scrollTrigger: { trigger: ".sv-hero", start: "top top", end: "bottom top", scrub: 0.8 },
        });

        /* Hero copy drifts up and dims as you leave it; the drawing sinks */
        const heroExit = { trigger: ".sv-hero", start: "top top", end: "bottom top", scrub: 0.8 };
        gsap.to(".sv-hero-inner", { y: -90, opacity: 0.25, ease: "power1.in", scrollTrigger: heroExit });
        gsap.to(".sv-hero-art", { yPercent: 30, ease: "none", scrollTrigger: heroExit });
        gsap.to(".sv-hero-grid", { yPercent: 12, opacity: 0.4, ease: "none", scrollTrigger: heroExit });

        /* Features unmask one after another, tied to the scroll position */
        gsap.utils.toArray<HTMLElement>(".sv-feature-grid", root).forEach((grid) => {
          gsap
            .timeline({ scrollTrigger: { trigger: grid, start: "top 88%", end: "center 55%", scrub: 0.6 } })
            .fromTo(
              grid.children,
              { clipPath: "inset(0% 0% 100% 0%)", y: 70, opacity: 0.2 },
              { clipPath: "inset(0% 0% 0% 0%)", y: 0, opacity: 1, stagger: 0.18, ease: "power2.out" },
            );
        });

        /* Section headings: the gold line sweeps in under the eyebrow */
        gsap.utils.toArray<HTMLElement>(".sv-heading .tm-eyebrow > span", root).forEach((line) => {
          gsap.fromTo(
            line,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, ease: "none", scrollTrigger: { trigger: line, start: "top 92%", end: "top 60%", scrub: true } },
          );
        });

        /*
         * Pricing. On desktop the section pins in place for roughly two screens of
         * scrolling: the glow blooms, the cards assemble, the prices count up, then
         * everything holds still for a beat before the page moves on.
         */
        const plans = root.querySelector<HTMLElement>(".sv-plans");
        const pricing = root.querySelector<HTMLElement>(".sv-pricing");
        if (plans && pricing) {
          const cards = gsap.utils.toArray<HTMLElement>(plans.children);
          const mid = (cards.length - 1) / 2;
          const prices = gsap.utils
            .toArray<HTMLElement>("[data-price]", plans)
            .map((el) => {
              const text = el.dataset.price ?? "";
              const match = text.match(/^(\D*)([\d,]+)(.*)$/);
              if (!match) return null;
              const target = Number(match[2].replace(/,/g, ""));
              const counter = { value: 0 };
              const render = () => {
                const value = Math.round(counter.value);
                el.textContent = value >= target ? text : `${match[1]}${value.toLocaleString("en-IN")}${match[3]}`;
                el.classList.toggle("is-counting", value > 0 && value < target);
              };
              return { el, target, counter, render };
            })
            .filter((p): p is NonNullable<typeof p> => p !== null);

          const pinned = window.matchMedia("(min-width: 1000px) and (min-height: 620px)").matches;

          if (pinned) {
            const tl = gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: {
                trigger: plans,
                pin: pricing,
                start: "center 58%",
                end: () => `+=${Math.round(window.innerHeight * 1.8)}`,
                scrub: 1,
                anticipatePin: 1,
                /* Measure the pin first so triggers further down include its extra scroll */
                refreshPriority: 1,
                invalidateOnRefresh: true,
              },
            });

            tl.fromTo(".sv-pricing-glow", { scale: 0.5, opacity: 0 }, { scale: 1.15, opacity: 1, duration: 0.5, ease: "none" }, 0);

            cards.forEach((card, i) => {
              const side = i - mid;
              const featured = card.classList.contains("is-featured");
              tl.fromTo(
                card,
                {
                  x: side * -160,
                  y: featured ? 180 : 110,
                  rotateY: side * -32,
                  rotateZ: side * 4,
                  scale: featured ? 0.78 : 0.88,
                  opacity: 0,
                  transformPerspective: 1200,
                },
                { x: 0, y: 0, rotateY: 0, rotateZ: 0, scale: 1, opacity: 1, duration: 0.45 },
                featured ? 0.12 : 0.02 + Math.abs(side) * 0.04,
              );
            });

            prices.forEach((p, i) => {
              p.render();
              tl.to(p.counter, { value: p.target, duration: 0.35, ease: "power1.out", onUpdate: p.render }, 0.4 + i * 0.04);
            });

            /* The hold: nothing moves while the plans are read */
            tl.to({}, { duration: 0.35 });
          } else {
            gsap.fromTo(
              ".sv-pricing-glow",
              { scale: 0.6, opacity: 0 },
              { scale: 1.15, opacity: 1, ease: "none", scrollTrigger: { trigger: pricing, start: "top 90%", end: "center center", scrub: true } },
            );
            cards.forEach((card) => {
              gsap.fromTo(
                card,
                { y: 80, scale: 0.94, opacity: 0 },
                { y: 0, scale: 1, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 95%", end: "top 65%", scrub: 0.5 } },
              );
            });
            prices.forEach((p) => {
              gsap.to(p.counter, {
                value: p.target,
                duration: 1.6,
                ease: "power3.out",
                onUpdate: p.render,
                scrollTrigger: { trigger: p.el, start: "top 85%", once: true },
              });
            });
          }

          /* Leave every price readable if the animation is torn down mid-count */
          return () =>
            prices.forEach(({ el }) => {
              el.textContent = el.dataset.price ?? el.textContent;
              el.classList.remove("is-counting");
            });
        }
      });
    }, root);

    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refresh);
      media.revert();
      context.revert();
    };
  }, [motionPaused]);

  /* Cards light up under the pointer */
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !window.matchMedia("(pointer: fine)").matches) return;
    function onMove(event: PointerEvent) {
      const card = (event.target as HTMLElement).closest<HTMLElement>(".sv-feature, .sv-plan, .sv-card, .sv-stat, .sv-audience-item");
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - box.left}px`);
      card.style.setProperty("--my", `${event.clientY - box.top}px`);
    }
    root.addEventListener("pointermove", onMove, { passive: true });
    return () => root.removeEventListener("pointermove", onMove);
  }, []);

  /* Custom cursor */
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || motionPaused) return;
    const query = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!query.matches) return;

    const moveX = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3.out" });
    function move(event: PointerEvent) {
      if (!cursor) return;
      moveX(event.clientX);
      moveY(event.clientY);
      cursor.style.opacity = "1";
      cursor.classList.toggle(
        "tm-cursor-active",
        Boolean((event.target as HTMLElement).closest("a, button, input, select, textarea, summary")),
      );
    }
    function hide() {
      if (cursor) cursor.style.opacity = "0";
    }
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      moveX.tween.kill();
      moveY.tween.kill();
      hide();
    };
  }, [motionPaused]);

  /* Menu & dropdown dismissal */
  useEffect(() => {
    if (!menuOpen && !moreOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (menuOpen) menuButtonRef.current?.focus();
      setMenuOpen(false);
      setMoreOpen(false);
    }
    function onOutside(event: PointerEvent) {
      const target = event.target as HTMLElement;
      if (menuOpen && !target.closest(".tm-header")) setMenuOpen(false);
      if (moreOpen && !moreRef.current?.contains(target)) setMoreOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [menuOpen, moreOpen]);

  const isCurrent = (href: string) => href === current;

  return (
    <div ref={rootRef} id="top" className={`tm-site sv-site sv-v-${variant} ${motionPaused ? "tm-motion-paused" : ""}`}>
      <a href="#main-content" className="tm-skip-link">Skip to content</a>
      <div className="tm-scroll-progress" aria-hidden="true" />
      <div ref={cursorRef} className="tm-cursor" aria-hidden="true" />

      <header className="tm-header">
        <div className="tm-container tm-header-inner">
          <Brand href="/" />

          <nav className="tm-desktop-nav" aria-label="Primary navigation">
            {nav.primary.map((item, i) => (
              <a
                href={siteHref(item.href)}
                key={i}
                className={isCurrent(item.href) ? "is-current" : undefined}
                aria-current={isCurrent(item.href) ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
            <div ref={moreRef} className={`tm-nav-more ${moreOpen ? "is-open" : ""}`}>
              <button
                type="button"
                className="tm-nav-more-toggle"
                aria-expanded={moreOpen}
                aria-controls="tm-nav-more-panel"
                onClick={() => setMoreOpen((v) => !v)}
              >
                {nav.moreLabel}
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2.5 4.5 6 8l3.5-3.5" />
                </svg>
              </button>
              <div id="tm-nav-more-panel" className="tm-nav-more-panel">
                {nav.more.map((item, i) => (
                  <a href={siteHref(item.href)} key={i} onClick={() => setMoreOpen(false)}>
                    {item.label} <Arrow diagonal />
                  </a>
                ))}
              </div>
            </div>
          </nav>

          <div className="tm-header-actions">
            <button
              type="button"
              className="tm-icon-button"
              aria-pressed={motionPaused}
              aria-label={motionPaused ? "Resume animations" : "Pause animations"}
              title={motionPaused ? "Resume motion" : "Pause motion"}
              onClick={() => setMotionPaused((v) => !v)}
            >
              <span aria-hidden="true">{motionPaused ? "▶" : "Ⅱ"}</span>
            </button>
            <a href="#contact" className="tm-header-contact">
              {nav.connectLabel} <Arrow diagonal />
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              className="tm-menu-button"
              aria-expanded={menuOpen}
              aria-controls="tm-mobile-nav"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        <nav id="tm-mobile-nav" className="tm-mobile-nav" aria-label="Mobile navigation" hidden={!menuOpen}>
          {nav.primary.map((item, i) => (
            <a
              href={siteHref(item.href)}
              key={i}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label} <Arrow diagonal />
            </a>
          ))}
          <span className="tm-mobile-nav-group tm-mono">{nav.moreLabel}</span>
          {nav.more.map((item, i) => (
            <a href={siteHref(item.href)} key={i} className="is-secondary" onClick={() => setMenuOpen(false)}>
              {item.label} <Arrow diagonal />
            </a>
          ))}
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>{children}</main>

      <footer className="tm-footer">
        <div className="tm-footer-line" aria-hidden="true" />
        <div className="tm-container">
          <div className="tm-footer-top">
            <div className="tm-footer-brand">
              <Brand href="/" />
              <span className="tm-mono tm-muted">{footer.location}</span>
            </div>
            <nav aria-label="Footer navigation" className="tm-footer-nav">
              <div>
                <span className="tm-mono tm-muted">SITE</span>
                {footer.siteLinks.map((link, i) => (
                  <a href={siteHref(link.href)} key={i}>{link.label}</a>
                ))}
              </div>
              <div>
                <span className="tm-mono tm-muted">CONNECT</span>
                <a href={footer.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  LinkedIn <Arrow diagonal />
                </a>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                <a href={`tel:+91${contact.phone}`}>+91 {contact.phone}</a>
              </div>
              <div>
                <span className="tm-mono tm-muted">LEGAL</span>
                {footer.legalLinks.map((link, i) => (
                  <a href={siteHref(link.href)} key={i}>{link.label}</a>
                ))}
              </div>
            </nav>
          </div>
          <div className="tm-footer-statement">
            <Emblem className="tm-footer-emblem" metallic />
            <strong>{footer.statementTitle}</strong>
            <p>{footer.statement}</p>
          </div>
          <div className="tm-footer-bottom">
            <p>© <CurrentYear /> {footer.copyright}</p>
            <p>
              {contact.name} · SEBI Research Analyst Reg. {contact.registration} · Valid {contact.validity}
            </p>
          </div>
          <p className="tm-footer-risk"><Rich text={footer.risk} /></p>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared sections                                                            */
/* -------------------------------------------------------------------------- */

/* Each page gets its own drawing, themed on what the service does. [data-draw] strokes animate in. */
function HeroArt({ variant }: { variant: string }) {
  if (variant === "ra-compliance") {
    /* Seal with a shield and tick: regulation and sign-off */
    return (
      <svg className="sv-hero-art sv-art-seal" viewBox="0 0 400 400" aria-hidden="true">
        <circle data-draw pathLength="1" cx="200" cy="200" r="180" />
        <circle data-draw pathLength="1" cx="200" cy="200" r="150" className="sv-art-faint" />
        <circle cx="200" cy="200" r="118" className="sv-art-dashed" />
        <path data-draw pathLength="1" d="M200 110 L270 135 V200 C270 250 235 280 200 295 C165 280 130 250 130 200 V135 Z" />
        <path data-draw pathLength="1" d="M168 200 L192 224 L236 178" className="sv-art-strong" />
      </svg>
    );
  }
  if (variant === "equity-swing-trading") {
    /* Higher highs and higher lows, with the pivots marked */
    const pts: [number, number][] = [[0, 250], [140, 170], [230, 215], [380, 120], [470, 165], [640, 70], [730, 110], [900, 30], [1000, 60], [1200, 10]];
    return (
      <svg className="sv-hero-art sv-art-swing" viewBox="0 0 1200 280" preserveAspectRatio="none" aria-hidden="true">
        <path data-draw pathLength="1" d={`M${pts.map((p) => p.join(" ")).join(" L")}`} />
        <path data-draw pathLength="1" d="M0 260 L1200 40" className="sv-art-faint" />
        {pts.slice(1, -1).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" className="sv-art-dot" />
        ))}
      </svg>
    );
  }
  if (variant === "option-selling") {
    /* Price oscillating inside a sold range, with a time-decay curve */
    return (
      <svg className="sv-hero-art sv-art-range" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true">
        <rect x="0" y="70" width="1200" height="160" className="sv-art-band" />
        <path d="M0 70 H1200 M0 230 H1200" className="sv-art-dashed" />
        <path
          data-draw
          pathLength="1"
          d="M0 150 C60 100 110 110 160 160 S260 210 320 150 S430 95 490 145 S600 205 660 150 S770 100 830 150 S940 200 1000 150 S1110 115 1200 150"
        />
        <path data-draw pathLength="1" d="M0 20 C500 30 850 80 1200 290" className="sv-art-faint" />
      </svg>
    );
  }
  if (variant === "option-buying") {
    /* Tight consolidation, then a breakout */
    return (
      <svg className="sv-hero-art sv-art-breakout" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true">
        <rect x="40" y="200" width="620" height="60" className="sv-art-band" />
        <path
          data-draw
          pathLength="1"
          d="M0 240 L60 225 L110 245 L170 220 L230 242 L290 222 L350 244 L410 218 L470 240 L530 220 L590 238 L650 215 L720 160 L780 175 L850 90 L900 110 L980 40 L1040 55 L1200 5"
        />
        <path d="M660 200 V10" className="sv-art-dashed" />
      </svg>
    );
  }
  return (
    <svg className="sv-hero-art sv-art-hub" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true">
      <path
        data-draw
        pathLength="1"
        d="M0 240 L90 225 L160 250 L250 190 L330 205 L420 150 L500 170 L590 120 L660 140 L760 90 L840 110 L930 60 L1010 80 L1100 35 L1200 50"
      />
    </svg>
  );
}

function Hero({
  variant,
  eyebrow,
  title,
  titleHighlight,
  intro,
  note,
  actions,
  children,
}: {
  variant: string;
  eyebrow: string;
  title: string;
  titleHighlight: string;
  intro: string;
  note?: string;
  actions: ReactNode;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  /* One orchestrated intro: backdrop, eyebrow, masked words, copy, chart draw */
  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add("is-ready");
      return;
    }

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(q(".sv-hero-grid"), { opacity: 0, scale: 1.08, duration: 1.8, ease: "power2.out" }, 0)
        .from(q(".sv-hero-emblem"), { opacity: 0, scale: 0.9, duration: 2.2, ease: "power2.out" }, 0)
        .from(q(".sv-hero-eyebrow > span"), { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power3.inOut" }, 0.15)
        .from(q(".sv-hero-eyebrow-text"), { opacity: 0, x: -12, duration: 0.8 }, 0.35)
        .from(q("[data-intro=word]"), { yPercent: 115, rotate: 3, duration: 1.25, stagger: 0.055 }, 0.3)
        .from(q("[data-intro=rise]"), { opacity: 0, y: 26, filter: "blur(8px)", duration: 1.1, stagger: 0.09, clearProps: "filter" }, 0.75)
        .from(q(".sv-hero-art"), { opacity: 0, duration: 0.6, ease: "none" }, 0.2)
        .fromTo(q("[data-draw]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, stagger: 0.15, ease: "power2.inOut" }, 0.25)
        .add(() => section.classList.add("is-shining"), 1.3);

      /* Drawing details differ per page (bands, dashed guides, pivot dots); only animate what exists */
      const details: [string, gsap.TweenVars, number][] = [
        [".sv-art-band", { scaleY: 0, transformOrigin: "50% 50%", duration: 1.4, ease: "power3.out" }, 0.4],
        [".sv-art-dashed", { opacity: 0, duration: 1 }, 0.9],
        [".sv-art-dot", { scale: 0, transformOrigin: "50% 50%", duration: 0.6, stagger: 0.12, ease: "back.out(2.5)" }, 1.2],
      ];
      details.forEach(([selector, vars, at]) => {
        const targets = q(selector);
        if (targets.length) tl.from(targets, vars, at);
      });

      /* from() has already applied the start states, so revealing now cannot flash */
      section.classList.add("is-ready");

      /* Gentle depth on pointer move */
      if (window.matchMedia("(pointer: fine)").matches) {
        const artX = gsap.quickTo(q(".sv-hero-art"), "x", { duration: 1.2, ease: "power3.out" });
        const embX = gsap.quickTo(q(".sv-hero-emblem"), "x", { duration: 1.4, ease: "power3.out" });
        const embY = gsap.quickTo(q(".sv-hero-emblem"), "y", { duration: 1.4, ease: "power3.out" });
        const onMove = (event: PointerEvent) => {
          if (document.querySelector(".tm-motion-paused")) return;
          const nx = event.clientX / window.innerWidth - 0.5;
          const ny = event.clientY / window.innerHeight - 0.5;
          artX(nx * -24);
          embX(nx * 30);
          embY(ny * 20);
        };
        section.addEventListener("pointermove", onMove, { passive: true });
        return () => section.removeEventListener("pointermove", onMove);
      }
    }, section);

    return () => {
      ctx.revert();
      section.classList.remove("is-ready", "is-shining");
    };
  }, []);

  const words = (text: string, offset = 0) =>
    text.split(/\s+/).filter(Boolean).map((word, i, all) => (
      <Fragment key={i}>
        <span className="sv-word" style={{ ["--i" as string]: offset + i }}>
          <span data-intro="word">{word}</span>
        </span>
        {i < all.length - 1 && " "}
      </Fragment>
    ));

  return (
    <section ref={ref} className={`sv-hero sv-hero-${variant}`} aria-labelledby="sv-hero-title">
      <div className="sv-hero-grid" aria-hidden="true" />
      <div className="sv-hero-glow" aria-hidden="true" />
      <Emblem className="sv-hero-emblem" metallic />
      <HeroArt variant={variant} />

      <div className="tm-container sv-hero-inner">
        <div className="tm-mono sv-hero-eyebrow">
          <span aria-hidden="true" />
          <span className="sv-hero-eyebrow-text" data-intro="fade">{eyebrow}</span>
        </div>
        <h1 id="sv-hero-title" className="sv-hero-title">
          <span className="sv-hero-line-text">{words(title)}</span>
          <span className="sv-hero-line-text sv-hero-gold">{words(titleHighlight, title.split(/\s+/).length)}</span>
        </h1>
        <p className="sv-hero-intro" data-intro="rise"><Rich text={intro} /></p>
        <div className="sv-hero-actions" data-intro="rise">{actions}</div>
        {note && <p className="sv-hero-note tm-mono" data-intro="rise">{note}</p>}
        {children}
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  highlight,
  intro,
  id,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  intro?: string;
  id?: string;
}) {
  return (
    <div className="tm-section-heading sv-heading tm-reveal">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id}>
          {title}
          {highlight && (
            <>
              <br />
              <span className="tm-gold-text">{highlight}</span>
            </>
          )}
        </h2>
      </div>
      {intro && <p><Rich text={intro} /></p>}
    </div>
  );
}

function ContactBlock({
  eyebrow,
  title,
  titleHighlight,
  text,
  inquiry,
  onInquiryChange,
}: {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  text: string;
  inquiry: string;
  onInquiryChange: (value: string) => void;
}) {
  const { contact, contactSection } = useContent();
  return (
    <section id="contact" className="tm-contact" aria-labelledby="contact-title">
      <div className="tm-contact-glow" aria-hidden="true" />
      <Emblem className="tm-contact-emblem" metallic />
      <div className="tm-container tm-contact-container">
        <div className="tm-contact-card tm-reveal">
          <div className="tm-contact-col-info">
            <div className="tm-contact-heading-group">
              <Eyebrow>{eyebrow}</Eyebrow>
              <h2 id="contact-title" className="tm-contact-main-title">
                {title}<br />
                <span className="tm-gold-text">{titleHighlight}</span>
              </h2>
              <p className="tm-contact-desc"><Rich text={text} /></p>
            </div>
            <div className="tm-contact-left-bottom">
              <div className="tm-contact-direct-list">
                <div className="tm-contact-direct-item">
                  <span className="tm-direct-label">{contactSection.emailLabel}</span>
                  <a href={`mailto:${contact.email}`} className="tm-direct-val">{contact.email}</a>
                </div>
                <div className="tm-contact-direct-item">
                  <span className="tm-direct-label">{contactSection.phoneLabel}</span>
                  <a href={`tel:+91${contact.phone}`} className="tm-direct-val">+91 {contact.phone}</a>
                </div>
                <div className="tm-contact-direct-item">
                  <span className="tm-direct-label">{contactSection.addressLabel}</span>
                  <span className="tm-direct-val">{contact.address}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="tm-contact-col-form">
            <div className="tm-contact-inner-box">
              <ContactForm inquiry={inquiry} onInquiryChange={onInquiryChange} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Registration facts right under the hero — the first thing a cautious visitor checks */
function TrustStrip() {
  const { contact } = useContent();
  const items = [
    ["SEBI REGISTERED RA", contact.registration],
    ["VALIDITY", contact.validity],
    ["ANALYST", contact.name],
    ["MODEL", "Fixed fee · Research only"],
  ];
  return (
    <div className="sv-trust" aria-label="Registration details">
      <div className="tm-container sv-trust-inner">
        {items.map(([label, value]) => (
          <div key={label} className="sv-trust-item">
            <span className="tm-mono">{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

const SECTION_LINKS = [
  ["overview", "Overview"],
  ["features", "Features"],
  ["process", "Process"],
  ["pricing", "Pricing"],
  ["faq", "FAQ"],
  ["contact", "Contact"],
] as const;

/* Sticky in-page navigation that tracks the section in view */
function SectionNav({ cta, hasFaq }: { cta: string; hasFaq: boolean }) {
  const links = SECTION_LINKS.filter(([id]) => hasFaq || id !== "faq");
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sections = links
      .map(([id]) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
        const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        if (best && best[1] > 0) setActive(best[0]);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.01, 0.25, 0.5, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFaq]);

  return (
    <nav className="sv-subnav" aria-label="On this page">
      <div className="tm-container sv-subnav-inner">
        <div className="sv-subnav-links">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? "is-active" : undefined} aria-current={active === id ? "true" : undefined}>
              {label}
            </a>
          ))}
        </div>
        <a href="#pricing" className="sv-subnav-cta tm-mono">
          {cta} <Arrow diagonal />
        </a>
      </div>
    </nav>
  );
}

/* Thumb-reach actions on phones, shown once the hero has scrolled away */
function MobileCta({ plans, contact }: { plans: string; contact: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const hero = document.querySelector(".sv-hero");
    const contactSection = document.getElementById("contact");
    if (!hero) return;
    let pastHero = false;
    let atContact = false;
    const update = () => setShown(pastHero && !atContact);
    const heroObserver = new IntersectionObserver(([entry]) => {
      pastHero = !entry.isIntersecting;
      update();
    });
    const contactObserver = new IntersectionObserver(([entry]) => {
      atContact = entry.isIntersecting;
      update();
    });
    heroObserver.observe(hero);
    if (contactSection) contactObserver.observe(contactSection);
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  return (
    <div className={`sv-mobile-cta ${shown ? "is-shown" : ""}`} aria-hidden={!shown}>
      <a href="#pricing" className="tm-button tm-button-ghost" tabIndex={shown ? 0 : -1}>
        <span>{plans}</span>
      </a>
      <a href="#contact" className="tm-button" tabIndex={shown ? 0 : -1}>
        <span>{contact}</span>
      </a>
    </div>
  );
}

const lines = (text: string) => text.split("\n").map((line) => line.trim()).filter(Boolean);

/* -------------------------------------------------------------------------- */
/* Service detail page                                                        */
/* -------------------------------------------------------------------------- */

export function ServiceDetail({ content, serviceKey }: { content: LandingContent; serviceKey: ServiceKey }) {
  return (
    <ContentContext.Provider value={content}>
      <ServiceDetailBody serviceKey={serviceKey} />
    </ContentContext.Provider>
  );
}

function ServiceDetailBody({ serviceKey }: { serviceKey: ServiceKey }) {
  const { services } = useContent();
  const service = services[serviceKey];
  const route = SERVICE_ROUTES.find((r) => r.key === serviceKey)!;
  const [inquiry, setInquiry] = useState(service.inquiry);

  const index = SERVICE_ROUTES.indexOf(route);
  const next = SERVICE_ROUTES[(index + 1) % SERVICE_ROUTES.length];
  const nextService = services[next.key];

  return (
    <SiteShell current={`/services/${route.slug}`} variant={route.slug}>
      <Hero
        variant={route.slug}
        eyebrow={service.hero.eyebrow}
        title={service.hero.title}
        titleHighlight={service.hero.titleHighlight}
        intro={service.hero.intro}
        note={service.hero.note}
        actions={
          <>
            <MagneticLink href="#pricing">{service.hero.primaryButton}</MagneticLink>
            <a className="tm-button tm-button-ghost" href="#contact">
              <span>{service.hero.secondaryButton}</span>
            </a>
          </>
        }
      >
        {service.stats.length > 0 && (
          <dl className="sv-stats">
            {service.stats.map((stat, i) => (
              <div key={i} className="sv-stat" data-intro="rise">
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Hero>

      <TrustStrip />
      <SectionNav cta={service.hero.primaryButton} hasFaq={service.faq.items.length > 0} />

      {/* Overview & audience */}
      <section id="overview" className="sv-section sv-overview" aria-labelledby="sv-overview-title">
        <div className="tm-container">
          <div className="sv-overview-grid">
            <div className="tm-reveal">
              <Eyebrow>{service.overview.eyebrow}</Eyebrow>
              <h2 id="sv-overview-title">
                {service.overview.title}<br />
                <span className="tm-gold-text">{service.overview.titleHighlight}</span>
              </h2>
              <p className="tm-body-copy sv-overview-text"><Rich text={service.overview.text} /></p>
            </div>
            <ul className="sv-audience sv-stagger">
              {service.audience.map((item, i) => (
                <li key={i} className="sv-audience-item">
                  <span className="tm-mono tm-gold">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="sv-section sv-features" aria-labelledby="sv-features-title">
        <div className="tm-container">
          <SectionHeading
            id="sv-features-title"
            eyebrow={service.features.eyebrow}
            title={service.features.title}
            intro={service.features.intro}
          />
          <div className="sv-feature-grid">
            {service.features.items.map((feature, i) => (
              <article key={i} className="sv-feature">
                <div className="sv-feature-head">
                  <span className="tm-mono tm-gold">{String(i + 1).padStart(2, "0")}</span>
                  {feature.tag && <span className="sv-chip">{feature.tag}</span>}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="sv-section sv-process-section" aria-labelledby="sv-process-title">
        <div className="tm-container">
          <SectionHeading id="sv-process-title" eyebrow={service.process.eyebrow} title={service.process.title} />
          <ol className="sv-process" style={{ ["--steps" as string]: service.process.steps.length }}>
            <span className="sv-process-line" aria-hidden="true" />
            {service.process.steps.map((step, i) => (
              <li key={i} className="sv-step tm-reveal">
                <span className="sv-step-dot" aria-hidden="true" />
                <span className="tm-mono tm-gold">{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="sv-section sv-pricing" aria-labelledby="sv-pricing-title">
        <div className="sv-pricing-glow" aria-hidden="true" />
        <div className="tm-container">
          <SectionHeading
            id="sv-pricing-title"
            eyebrow={service.pricing.eyebrow}
            title={service.pricing.title}
            highlight={service.pricing.titleHighlight}
            intro={service.pricing.intro}
          />
          <div className="sv-plans" data-count={service.plans.length}>
            {service.plans.map((plan, i) => (
              <article key={i} className={`sv-plan ${plan.highlighted ? "is-featured" : ""}`}>
                {plan.badge && <span className="sv-plan-badge tm-mono">{plan.badge}</span>}
                <h3 className="sv-plan-name">{plan.name}</h3>
                <p className="sv-plan-desc">{plan.description}</p>
                <div className="sv-plan-price">
                  <strong data-price={plan.price}>{plan.price}</strong>
                  {plan.period && <span className="tm-mono">/ {plan.period}</span>}
                </div>
                <ul className="sv-plan-features">
                  {lines(plan.features).map((feature, j) => (
                    <li key={j}>
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M3 8.5 6.5 12 13 4.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`tm-button sv-plan-cta ${plan.highlighted ? "" : "tm-button-ghost"}`}
                  onClick={() => setInquiry(`${service.inquiry} — ${plan.name} plan`)}
                >
                  <span>{plan.ctaLabel}</span>
                  <Arrow diagonal />
                </a>
              </article>
            ))}
          </div>
          {service.pricing.note && <p className="tm-fine-print sv-pricing-note">{service.pricing.note}</p>}
        </div>
      </section>

      {/* FAQ */}
      {service.faq.items.length > 0 && (
        <section id="faq" className="sv-section sv-faq-section" aria-labelledby="sv-faq-title">
          <div className="tm-container sv-faq-grid">
            <div className="tm-reveal">
              <Eyebrow>{service.faq.eyebrow}</Eyebrow>
              <h2 id="sv-faq-title">{service.faq.title}</h2>
            </div>
            <div className="sv-faq sv-stagger">
              {service.faq.items.map((item, i) => (
                <details key={i} className="sv-faq-item" open={i === 0}>
                  <summary>
                    <span>{item.question}</span>
                    <span className="sv-faq-icon" aria-hidden="true" />
                  </summary>
                  <p><Rich text={item.answer} /></p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Disclaimer + next service */}
      <section className="sv-section sv-closing">
        <div className="tm-container">
          {service.disclaimer && (
            <div className="sv-disclaimer tm-reveal" role="note">
              <span className="tm-mono tm-gold">RISK DISCLOSURE</span>
              <p><Rich text={service.disclaimer} /></p>
            </div>
          )}
          <a href={`/services/${next.slug}`} className="sv-next tm-reveal">
            <span className="tm-mono tm-muted">NEXT SERVICE</span>
            <strong>{nextService.navLabel}</strong>
            <Arrow />
          </a>
        </div>
      </section>

      <MobileCta plans={service.hero.primaryButton} contact={service.cta.button} />

      <ContactBlock
        eyebrow={service.cta.eyebrow}
        title={service.cta.title}
        titleHighlight={service.cta.titleHighlight}
        text={service.cta.text}
        inquiry={inquiry}
        onInquiryChange={setInquiry}
      />
    </SiteShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Services overview page                                                     */
/* -------------------------------------------------------------------------- */

export function ServicesHub({ content }: { content: LandingContent }) {
  return (
    <ContentContext.Provider value={content}>
      <ServicesHubBody />
    </ContentContext.Provider>
  );
}

function ServicesHubBody() {
  const { services, contactSection } = useContent();
  const { hub } = services;
  const [inquiry, setInquiry] = useState(contactSection.inquiryTypes[0] ?? "");

  return (
    <SiteShell current="/services" variant="hub">
      <Hero
        variant="hub"
        eyebrow={hub.eyebrow}
        title={hub.title}
        titleHighlight={hub.titleHighlight}
        intro={hub.intro}
        actions={
          <>
            <MagneticLink href="#services">{hub.cardCta}</MagneticLink>
            <a className="tm-button tm-button-ghost" href="#contact">
              <span>{contactSection.ctaButton}</span>
            </a>
          </>
        }
      />

      <section id="services" className="sv-section" aria-label="Services">
        <div className="tm-container">
          <div className="sv-cards sv-stagger">
            {SERVICE_ROUTES.map(({ slug, key }, i) => {
              const service = services[key];
              const firstPlan = service.plans[0];
              return (
                <a key={slug} href={`/services/${slug}`} className="sv-card">
                  <div className="sv-card-head">
                    <span className="tm-mono tm-gold">{String(i + 1).padStart(2, "0")}</span>
                    <span className="sv-chip">{service.cardTag}</span>
                  </div>
                  <h2 className="sv-card-title">{service.navLabel}</h2>
                  <p className="sv-card-text">{service.summary}</p>
                  <div className="sv-card-foot">
                    {firstPlan && (
                      <div className="sv-card-price">
                        <span className="tm-mono tm-muted">{hub.priceLabel}</span>
                        <strong>{firstPlan.price}</strong>
                        <span className="tm-mono tm-muted">{firstPlan.period}</span>
                      </div>
                    )}
                    <span className="sv-card-cta tm-mono">
                      {hub.cardCta} <Arrow />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {hub.commitments.length > 0 && (
        <section className="sv-section sv-features" aria-labelledby="sv-commit-title">
          <div className="tm-container">
            <SectionHeading id="sv-commit-title" eyebrow={hub.compareEyebrow} title={hub.compareTitle} />
            <div className="sv-feature-grid sv-commitments">
              {hub.commitments.map((item, i) => (
                <article key={i} className="sv-feature">
                  <div className="sv-feature-head">
                    <span className="tm-mono tm-gold">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactBlock
        eyebrow={contactSection.eyebrow}
        title={contactSection.title}
        titleHighlight={contactSection.titleHighlight}
        text={contactSection.description}
        inquiry={inquiry}
        onInquiryChange={setInquiry}
      />
    </SiteShell>
  );
}
