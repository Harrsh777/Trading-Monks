"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LoadingScreen from "./components/LoadingScreen";
import SplitText from "@/components/SplitText";
import { TestimonialsSection } from "@/components/testimonials-section";
import "./page.css";

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

const CONTACT = {
  email: "budhirajamanas23@gmail.com",
  phone: "9871861054",
  address: "B Block, East of Kailash, New Delhi - 110065",
  name: "Manas Budhiraja",
  registration: "INH000025027",
  validity: "16th February, 2026 - 15th February, 2031",
};

const TESTIMONIALS = [
  {
    author: {
      name: "Rajeshwar Rao",
      handle: "HNI Equity Investor · Mumbai",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    },
    text: "Trading Monks replaced noisy tipsters with institutional-grade structural mapping. The invalidation levels and risk-reward clarity give our portfolio true tranquility.",
  },
  {
    author: {
      name: "Ananya Deshmukh",
      handle: "Prop Desk Trader · Bengaluru",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
    },
    text: "Manas’s asymmetric setup framework is world-class. It is rare to see a SEBI RA who puts strict invalidation boundaries ahead of hype. Outstanding discipline.",
  },
  {
    author: {
      name: "Vikram Singhania",
      handle: "Derivatives Strategist · Delhi NCR",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    },
    text: "The combination of price structure, volume participation, and risk governance is pure precision. My win-loss asymmetry increased significantly within 3 months.",
  },
  {
    author: {
      name: "Siddharth Nair",
      handle: "Portfolio Allocator · Hyderabad",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    },
    text: "Clean, unbiased, and completely devoid of greed or panic. The research dossier is the only report I read before market open every morning.",
  },
  {
    author: {
      name: "Kavita Ramachandran",
      handle: "Fund Analyst · Chennai",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    },
    text: "The three-tier framework filtering technical geometry through fundamental balance sheets is exceptional. High signal-to-noise ratio in Indian equities.",
  },
];

type NavItem = { label: string; href: string; inquiry?: string };

/* Research services open the contact form with the matching inquiry selected */
const NAV_PRIMARY: NavItem[] = [
  { label: "RA Compliance", href: "#edge" },
  { label: "Equity Swing Trading Research", href: "#contact", inquiry: "Equity swing trading research" },
  { label: "Option Selling Research", href: "#contact", inquiry: "Option selling research" },
  { label: "Option Buying", href: "#contact", inquiry: "Option buying research" },
];

/* Page sections, grouped under "More" */
const NAV_MORE = [
  ["Markets", "#market"],
  ["Philosophy", "#philosophy"],
  ["Approach", "#strategy"],
  ["Credentials", "#edge"],
  ["Testimonials", "#testimonials"],
  ["Contact", "#contact"],
] as const;

/* Illustrative only. Replace with an authorised feed or remove. */
const TICKER = [
  { name: "NIFTY 50", value: "22,418.60", change: "+0.64%", up: true },
  { name: "SENSEX", value: "73,872.29", change: "+0.51%", up: true },
  { name: "BANK NIFTY", value: "47,315.20", change: "−0.28%", up: false },
  { name: "INDIA VIX", value: "13.42", change: "−1.12%", up: false },
  { name: "USD / INR", value: "83.21", change: "+0.04%", up: true },
];

const CONCEPTS = [
  {
    index: "01",
    name: "Market structure",
    text: "Price behaviour at support, resistance and consolidation zones — read before any view is formed.",
    candle: 16,
  },
  {
    index: "02",
    name: "Research discipline",
    text: "Technical structure is checked against volume participation, business quality and the wider market environment.",
    candle: 40,
  },
  {
    index: "03",
    name: "Risk awareness",
    text: "Invalidation levels and exposure boundaries are defined before an opportunity is pursued.",
    candle: 62,
  },
];

const PRINCIPLES = [
  {
    number: "01",
    tag: "STRUCTURAL EDGE",
    title: "Research",
    text: "Decisions informed by price geometry and volume participation, never speculative market noise.",
    iconType: "chart",
  },
  {
    number: "02",
    tag: "SYSTEMATIC CALM",
    title: "Discipline",
    text: "A non-negotiable process that neutralises greed and fear, ensuring consistency across market cycles.",
    iconType: "balance",
  },
  {
    number: "03",
    tag: "CAPITAL PRESERVATION",
    title: "Risk Awareness",
    text: "Invalidation boundaries and asymmetric payoff profiles defined explicitly before capital is committed.",
    iconType: "shield",
  },
] as const;

const STAGES = [
  {
    number: "01",
    name: "Observe",
    label: "PRICE / LEVELS / CONTEXT",
    title: "First, remove the noise.",
    text: "Read price behaviour at support, resistance and consolidation zones. Map the structure before forming a view.",
    signal: "KEY ZONES IDENTIFIED",
    pill: "Clean Price Action",
  },
  {
    number: "02",
    name: "Validate",
    label: "VOLUME / TREND / FUNDAMENTALS",
    title: "Conviction needs evidence.",
    text: "Study volume participation, trend strength, earnings and balance-sheet quality, and the broader market environment.",
    signal: "INSTITUTIONAL ACCUMULATION",
    pill: "Volume & Momentum",
  },
  {
    number: "03",
    name: "Structure",
    label: "ENTRY / INVALIDATION / PARAMETERS",
    title: "Define the downside first.",
    text: "Set out entry zones, invalidation levels and research parameters. A perspective is incomplete without them.",
    signal: "R:R 3.4 : 1 ASYMMETRY",
    pill: "Strict Invalidation",
  },
  {
    number: "04",
    name: "Define risk",
    label: "EXPOSURE / VOLATILITY / EVENTS",
    title: "Boundaries before conviction.",
    text: "Downside exposure, volatility, liquidity and event risk are stated explicitly in every research view.",
    signal: "EVENT RISK MAPPED",
    pill: "Capital Preservation",
  },
  {
    number: "05",
    name: "Review",
    label: "MONITOR / REASSESS / DISCLOSE",
    title: "A view is never final.",
    text: "Published perspectives are monitored against their stated parameters and reassessed when the structure changes.",
    signal: "STRUCTURE INTEGRITY",
    pill: "Dynamic Monitoring",
  },
];

const INQUIRY_TYPES = [
  "Research inquiry",
  "Equity swing trading research",
  "Option selling research",
  "Option buying research",
  "Professional dialogue",
  "Collaboration",
  "Media",
  "Other",
];

/* -------------------------------------------------------------------------- */
/* Primitives                                                                 */
/* -------------------------------------------------------------------------- */

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Geometric bull-and-monk brand emblem (Trading Monks icon):
 * Half low-poly bull (trading) and half cyber-monk with visor and telemetry dots.
 * Every path carries pathLength="1" so stroke-dashoffset can be animated 1 → 0
 * without measuring path lengths at runtime.
 */
function Emblem({
  className = "",
  metallic = false,
}: {
  className?: string;
  metallic?: boolean;
}) {
  const id = useId();
  const stroke = metallic ? `url(#${id})` : "currentColor";

  const paths = [
    // Center dividing line
    "M 95.8 52.2 V 151.0",
    // Monk helmet outer contour & ear module
    "M 95.8 52.2 C 117.4 50.0 140.1 70.6 141.2 84.6 L 148.7 84.6 L 148.7 113.8 L 141.2 113.8 C 139.0 125.7 133.6 137.5 127.1 142.9 L 133.6 155.9 L 145.5 168.9",
    // Nape of neck line
    "M 133.6 155.9 L 133.6 173.2",
    // Throat & chest lines
    "M 95.8 151.0 L 90.4 168.9 L 36.4 168.9 L 36.4 184.0",
    // Bull Horn outer & inner ridges
    "M 18.0 16.0 L 25.6 28.4 L 41.8 39.2 L 61.2 45.7 L 78.5 50.0 L 95.8 52.2",
    "M 18.0 16.0 L 20.2 30.6 L 26.6 40.3 L 41.8 47.9 L 60.1 53.3 L 95.8 52.2",
    "M 25.6 28.4 L 20.2 30.6 L 31.0 33.8 L 25.6 28.4 L 41.8 39.2 L 31.0 33.8 L 26.6 40.3 L 41.8 39.2",
    "M 41.8 39.2 L 48.3 41.4 L 26.6 40.3 L 41.8 47.9 L 48.3 41.4 L 61.2 45.7",
    "M 61.2 45.7 L 68.8 47.9 L 41.8 47.9 L 60.1 53.3 L 68.8 47.9 L 78.5 50.0",
    // Bull Ear
    "M 41.8 47.9 L 43.9 57.6 L 33.1 79.2 L 63.4 85.7 L 43.9 57.6",
    "M 60.1 53.3 L 43.9 57.6",
    // Forehead & Brow facets
    "M 78.5 50.0 L 78.5 53.3 L 95.8 52.2 L 78.5 53.3 L 72.0 60.8 L 78.5 50.0",
    "M 78.5 53.3 L 95.8 66.2 L 83.9 65.2 L 72.0 60.8",
    "M 43.9 57.6 L 72.0 60.8 L 74.2 74.9 L 60.1 66.2 L 43.9 57.6",
    "M 74.2 74.9 L 82.8 70.6 L 83.9 65.2 L 82.8 70.6 L 95.8 79.2 L 91.5 79.2 L 82.8 70.6",
    "M 91.5 79.2 L 95.8 92.2",
    "M 60.1 66.2 L 62.3 79.2 L 63.4 85.7",
    // Snout & Bridge facets
    "M 62.3 79.2 L 62.3 99.7 L 74.2 117.0 L 77.4 139.7 L 90.4 148.3 L 95.8 151.0",
    "M 62.3 79.2 L 74.2 85.7 L 74.2 74.9 L 74.2 85.7 L 82.8 90.0 L 82.8 70.6",
    "M 82.8 90.0 L 95.8 92.2 L 91.5 92.2 L 82.8 90.0 L 91.5 92.2 L 95.8 112.7",
    "M 62.3 99.7 L 74.2 85.7 L 75.3 99.7 L 62.3 99.7 L 75.3 99.7 L 85.0 103.0 L 82.8 90.0",
    "M 85.0 103.0 L 91.5 92.2 L 91.5 109.5 L 85.0 103.0 L 91.5 109.5 L 95.8 112.7",
    // Lower Cheek, Muzzle & Jaw facets
    "M 62.3 99.7 L 80.7 118.1 L 75.3 99.7 L 74.2 117.0 L 80.7 118.1 L 86.1 124.6 L 85.0 103.0",
    "M 86.1 124.6 L 91.5 109.5 L 86.1 124.6 L 95.8 130.5",
    "M 74.2 117.0 L 83.9 135.4 L 80.7 118.1 L 77.4 139.7 L 83.9 135.4 L 86.1 124.6",
    "M 83.9 135.4 L 95.8 130.5 L 95.8 140.8 L 83.9 135.4 L 90.4 148.3 L 95.8 140.8",
  ];

  return (
    <svg viewBox="0 0 200 200" className={`tm-emblem ${className}`} aria-hidden="true">
      {metallic && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6e9c4" />
            <stop offset="0.45" stopColor="#d6b574" />
            <stop offset="1" stopColor="#5e4a20" />
          </linearGradient>
        </defs>
      )}

      {/* Monk visor faceplate */}
      <path
        d="M 95.8 52.2 L 115.2 52.2 L 133.6 61.9 L 136.8 74.9 L 136.8 123.5 L 106.6 151.0 L 95.8 151.0 Z"
        className="tm-emblem-visor"
        fill="currentColor"
        fillOpacity={0.22}
      />

      {/* Visor telemetry dots */}
      <circle cx="105.5" cy="65.2" r="2.2" fill={stroke} className="tm-emblem-dot" />
      <circle cx="105.5" cy="74.9" r="2.2" fill={stroke} className="tm-emblem-dot" />
      <circle cx="105.5" cy="83.5" r="2.2" fill={stroke} className="tm-emblem-dot" />

      {/* Shoulder accent wedge */}
      <polygon
        points="133.6,155.9 169.3,164.6 169.3,185.1 116.3,185.1"
        fill={stroke}
        className="tm-emblem-wedge"
      />

      {/* Geometric wireframe paths */}
      <g
        fill="none"
        stroke={stroke}
        strokeWidth={metallic ? 2.0 : 1.4}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {paths.map((d) => (
          <path key={d} d={d} pathLength="1" className="tm-emblem-path" />
        ))}
      </g>
    </svg>
  );
}

function Brand() {
  return (
    <a href="#top" className="tm-brand" aria-label="Trading Monks — home">
      <Emblem className="tm-brand-emblem" />
      <span>
        TRADING<span className="tm-brand-secondary">MONKS</span>
      </span>
    </a>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="tm-eyebrow">
      <span aria-hidden="true" />
      {children}
    </div>
  );
}

function CurrentYear() {
  const [year, setYear] = useState<number | string>(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <>{year}</>;
}

function MagneticLink({
  href,
  children,
  ghost = false,
}: {
  href: string;
  children: ReactNode;
  ghost?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <a
      ref={ref}
      href={href}
      className={`tm-button ${ghost ? "tm-button-ghost" : ""}`}
      onPointerMove={(event) => {
        if (
          event.pointerType !== "mouse" ||
          window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
          document.querySelector(".tm-motion-paused")
        ) {
          return;
        }
        const b = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - b.left - b.width / 2) * 0.12;
        const y = (event.clientY - b.top - b.height / 2) * 0.16;
        if (ref.current) ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
      onBlur={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      <span>{children}</span>
      <Arrow diagonal />
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/* 01 — Hero static stock image: Bull & Bear standoff                          */
/* -------------------------------------------------------------------------- */

export function HeroImage({ darkLayerActive = false }: { darkLayerActive?: boolean }) {
  return (
    <div className="tm-hero-media" aria-hidden="true">
      <img
        src="/bull-bear-hero.png"
        alt="Trading Monks Bull and Bear Market Standoff"
        className="tm-hero-img"
        fetchPriority="high"
        decoding="async"
      />
      <div className={`tm-hero-dark-layer ${darkLayerActive ? "is-active" : ""}`} />
      <div className="tm-hero-overlay tm-hero-overlay-left" />
      <div className="tm-hero-overlay tm-hero-overlay-top" />
      <div className="tm-hero-overlay tm-hero-overlay-bottom" />
      <div className="tm-hero-overlay tm-hero-overlay-vignette" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 02 — Scroll-driven market visualisation (illustrative data)                */
/* -------------------------------------------------------------------------- */

const SERIES_LENGTH = 72;

function makeSeries() {
  let previous = 300;
  return Array.from({ length: SERIES_LENGTH }, (_, i) => {
    const open = previous;
    const close =
      open + Math.sin(i * 1.7) * 14 + Math.cos(i * 0.37) * 9 - 1.4 + (i > 44 ? 2.6 : 0);
    const high = Math.max(open, close) + 4 + Math.abs(Math.sin(i * 2.3)) * 9;
    const low = Math.min(open, close) - 4 - Math.abs(Math.cos(i * 1.9)) * 9;
    previous = close;
    return { open, close, high, low };
  });
}

function MarketScene() {
  const data = makeSeries();
  const min = Math.min(...data.map((d) => d.low)) - 10;
  const max = Math.max(...data.map((d) => d.high)) + 10;
  const y = (v: number) => 560 - ((v - min) / (max - min)) * 440;
  const x = (i: number) => 48 + i * 21;

  return (
    <div className="tm-market-visual">
      <svg
        className="tm-market-svg"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Illustrative candlestick visualisation. Not live market data."
      >
        <g className="tm-m-world">
          {/* fine vertical lines */}
          {Array.from({ length: 90 }, (_, i) => (
            <line key={i} x1={i * 18} x2={i * 18} y1="0" y2="600" className="tm-m-vline" />
          ))}
          {/* horizontal grid */}
          {[120, 240, 360, 480].map((gy) => (
            <line key={gy} x1="0" x2="1600" y1={gy} y2={gy} className="tm-m-hline" />
          ))}

          {data.map((d, i) => {
            const up = d.close >= d.open;
            const top = Math.min(y(d.open), y(d.close));
            const height = Math.max(2, Math.abs(y(d.close) - y(d.open)));
            return (
              <g key={i} className={`tm-m-candle ${up ? "is-up" : "is-down"}`}>
                <line x1={x(i)} x2={x(i)} y1={y(d.high)} y2={y(d.low)} />
                <rect x={x(i) - 5} y={top} width="10" height={height} rx="0.5" />
              </g>
            );
          })}

          {CONCEPTS.map((c) => (
            <g key={c.index} className="tm-m-highlight">
              <circle cx={x(c.candle)} cy={y(data[c.candle].close)} r="18" />
              <circle cx={x(c.candle)} cy={y(data[c.candle].close)} r="4" />
              <line
                x1={x(c.candle)}
                x2={x(c.candle)}
                y1={y(data[c.candle].close) - 18}
                y2={y(data[c.candle].close) - 70}
              />
              <text x={x(c.candle) + 10} y={y(data[c.candle].close) - 72}>
                {c.index} / {c.name.toUpperCase()}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <span className="tm-demo-badge tm-market-badge">ILLUSTRATIVE VISUALISATION · NOT LIVE</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 04 — Scroll-driven strategy film (illustrative data)                       */
/* -------------------------------------------------------------------------- */

const SX = {
  left: 40,
  right: 1060,
  top: 56,
  bottom: 456,
  volTop: 492,
  volBottom: 600,
  axis: 1084,
  min: 22000,
  max: 23400,
};
const SX_LAST = 119;
const SX_NOW = 81;
const SX_ENTRY = 74;
const SX_LEVELS = {
  support: 22150,
  resistance: 22650,
  entryLow: 22660,
  entryHigh: 22700,
  entry: 22680,
  stop: 22480,
  target: 23360,
};
const SX_EVENTS = [
  { index: 92, label: "Q3 RESULTS" },
  { index: 106, label: "RBI POLICY" },
];
/* [index, price] waypoints — a range, a breakout, a retest, then the trend */
const SX_WAYPOINTS: [number, number][] = [
  [0, 22320], [4, 22610], [9, 22170], [14, 22640], [20, 22160], [26, 22645],
  [32, 22240], [37, 22600], [42, 22300], [48, 22620], [52, 22420], [58, 22636],
  [63, 22500], [68, 22790], [74, 22678], [81, 22815], [87, 22990], [92, 22880],
  [99, 23180], [104, 23090], [111, 23300], [115, 23230], [119, 23380],
];
const SX_TOUCHES = [4, 9, 14, 20, 26, 48, 58];

const sxX = (i: number) => SX.left + (i / SX_LAST) * (SX.right - SX.left);
const sxY = (price: number) =>
  SX.bottom - ((price - SX.min) / (SX.max - SX.min)) * (SX.bottom - SX.top);
const sxPrice = (price: number) => Math.round(price).toLocaleString("en-IN");
/* Trig output differs in the last bits between server and browser — round it away */
const sxRound = (n: number) => Math.round(n * 100) / 100;

const SX_CLEAN = Array.from({ length: SX_LAST + 1 }, (_, i) => {
  const next = SX_WAYPOINTS.findIndex(([at]) => at >= i);
  const [a, pa] = SX_WAYPOINTS[Math.max(0, next - 1)];
  const [b, pb] = SX_WAYPOINTS[next];
  const f = b === a ? 0 : (i - a) / (b - a);
  const eased = (1 - Math.cos(f * Math.PI)) / 2;
  return sxRound(pa + (pb - pa) * eased + Math.sin(f * Math.PI) * Math.sin(i * 1.7) * 18);
});

const SX_NOISE = SX_CLEAN.map((_, i) =>
  i === 0 ? 0 : sxRound(Math.sin(i * 2.9) * 120 + Math.sin(i * 7.3 + 1) * 70 + Math.cos(i * 13.7) * 45),
);

const SX_VOLUME = Array.from({ length: 40 }, (_, k) => {
  const i = k * 3 + 1;
  const accumulation = i >= 46 && i <= SX_NOW;
  const ramp = accumulation ? ((i - 46) / (SX_NOW - 46)) * 0.38 : 0;
  const breakout = Math.abs(i - 68) <= 2 ? 0.28 : 0;
  const value = sxRound(Math.min(1, 0.2 + Math.abs(Math.sin(k * 1.31)) * 0.2 + ramp + breakout));
  return { i, value, accumulation };
});

const sxBarHeight = (value: number) => value * (SX.volBottom - SX.volTop - 8);

const SX_VOLUME_MA = SX_VOLUME.map((bar, k) => {
  const span = SX_VOLUME.slice(Math.max(0, k - 4), k + 1);
  const average = span.reduce((sum, v) => sum + v.value, 0) / span.length;
  return `${k ? "L" : "M"}${sxX(bar.i).toFixed(1)} ${(SX.volBottom - sxBarHeight(average)).toFixed(1)}`;
}).join("");

type StrategyFrame = { reveal: number; noise: number };
const SX_FINAL: StrategyFrame = { reveal: SX_LAST, noise: 0 };

function sxFrame({ reveal, noise }: StrategyFrame) {
  const series = SX_CLEAN.map((p, i) =>
    Math.min(SX.max - 16, Math.max(SX.min + 16, p + SX_NOISE[i] * noise)),
  );
  const line = series
    .map((p, i) => `${i ? "L" : "M"}${sxX(i).toFixed(1)} ${sxY(p).toFixed(1)}`)
    .join("");
  const i = Math.min(SX_LAST - 1, Math.floor(reveal));
  const price = series[i] + (series[i + 1] - series[i]) * (reveal - i);
  return {
    line,
    area: `${line}L${SX.right} ${SX.bottom}L${SX.left} ${SX.bottom}Z`,
    x: sxX(reveal),
    y: sxY(price),
    price,
  };
}

/* Writes one frame straight to the DOM — called on every scrubbed tick. */
function paintStrategyChart(svg: SVGSVGElement, frame: StrategyFrame) {
  const { line, area, x, y, price } = sxFrame(frame);
  const set = (selector: string, attrs: Record<string, string | number>) => {
    const el = svg.querySelector(selector);
    if (el) for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
  };
  set(".tm-sx-line", { d: line });
  set(".tm-sx-area", { d: area });
  set(".tm-sx-reveal", { width: x + 2 });
  set(".tm-sx-guide", { x1: x, y1: y, y2: y });
  set(".tm-sx-tip", { transform: `translate(${x} ${y})` });
  set(".tm-sx-tag", { transform: `translate(${SX.axis} ${y})` });
  const tag = svg.querySelector(".tm-sx-tag-text");
  if (tag) tag.textContent = sxPrice(price);
}

function StrategyChart() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const f = sxFrame(SX_FINAL);
  const entryX = sxX(SX_ENTRY);
  const zoneWidth = SX.right - entryX;
  const zoneCenter = entryX + zoneWidth / 2;

  return (
    <svg
      className="tm-sx-svg"
      viewBox="0 0 1200 640"
      role="img"
      aria-label="Illustrative price chart walking through the five research stages. Not live market data."
    >
      <defs>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6b574" stopOpacity="0.3" />
          <stop offset="1" stopColor="#d6b574" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-reveal`}>
          <rect className="tm-sx-reveal" x="0" y="0" width={f.x + 2} height="640" />
        </clipPath>
      </defs>

      {/* Grid and price axis */}
      <g className="tm-sx-grid">
        {Array.from({ length: 13 }, (_, k) => (
          <line key={k} className="tm-sx-vgrid" x1={SX.left + k * 85} x2={SX.left + k * 85} y1={SX.top} y2={SX.volBottom} />
        ))}
        {[22000, 22200, 22400, 22600, 22800, 23000, 23200, 23400].map((p) => (
          <g key={p}>
            <line x1={SX.left} x2={SX.axis} y1={sxY(p)} y2={sxY(p)} />
            <text x="1190" y={sxY(p) + 4} textAnchor="end">{sxPrice(p)}</text>
          </g>
        ))}
        <line className="tm-sx-axis" x1={SX.left} x2={SX.axis} y1={SX.volBottom} y2={SX.volBottom} />
        <text className="tm-sx-axis-label" x={SX.left + 6} y={SX.volTop + 12}>VOLUME</text>
      </g>

      {/* 02 — Volume participation */}
      <g className="tm-sx-volume" clipPath={`url(#${id}-reveal)`}>
        {SX_VOLUME.map((bar) => {
          const h = sxBarHeight(bar.value);
          return (
            <rect
              key={bar.i}
              className={`tm-sx-bar ${bar.accumulation ? "is-accum" : ""}`}
              x={sxX(bar.i) - 6}
              y={SX.volBottom - h}
              width="12"
              height={h}
              rx="1.5"
            />
          );
        })}
        <path className="tm-sx-vol-ma" d={SX_VOLUME_MA} pathLength="1" />
      </g>
      <g className="tm-sx-accum">
        <path d={`M${sxX(46)} ${SX.volTop}v-8H${sxX(SX_NOW)}v8`} />
        <text x={(sxX(46) + sxX(SX_NOW)) / 2} y={SX.volTop - 16} textAnchor="middle">
          ACCUMULATION
        </text>
      </g>

      {/* 01 — Structure: support and resistance */}
      <g className="tm-sx-levels">
        {([
          ["is-resistance", "RESISTANCE", SX_LEVELS.resistance, -12],
          ["is-support", "SUPPORT", SX_LEVELS.support, 24],
        ] as const).map(([tone, name, p, dy]) => (
          <g key={name} className={`tm-sx-level ${tone}`}>
            <line className="tm-sx-level-line" x1={SX.left} x2={SX.right} y1={sxY(p)} y2={sxY(p)} />
            <text className="tm-sx-level-label" x={SX.left + 10} y={sxY(p) + dy}>
              {name} · {sxPrice(p)}
            </text>
          </g>
        ))}
        {SX_TOUCHES.map((i) => (
          <circle key={i} className="tm-sx-touch" cx={sxX(i)} cy={sxY(SX_CLEAN[i])} r="6" />
        ))}
      </g>

      {/* 04 — Exposure: reward vs risk and scheduled events */}
      <g className="tm-sx-risk">
        <rect
          className="tm-sx-reward"
          x={entryX}
          y={sxY(SX_LEVELS.target)}
          width={zoneWidth}
          height={sxY(SX_LEVELS.entry) - sxY(SX_LEVELS.target)}
        />
        <rect
          className="tm-sx-loss"
          x={entryX}
          y={sxY(SX_LEVELS.entry)}
          width={zoneWidth}
          height={sxY(SX_LEVELS.stop) - sxY(SX_LEVELS.entry)}
        />
        {SX_EVENTS.map((event) => (
          <line
            key={event.index}
            className="tm-sx-event-line"
            x1={sxX(event.index)}
            x2={sxX(event.index)}
            y1={SX.top + 24}
            y2={SX.bottom}
          />
        ))}
      </g>

      {/* Price — line and area share one clip that the scroll reveals */}
      <g className="tm-sx-price" clipPath={`url(#${id}-reveal)`}>
        <path className="tm-sx-area" d={f.area} fill={`url(#${id}-area)`} />
        <path className="tm-sx-line" d={f.line} />
      </g>

      {/* 03 — The plan: entry, target, invalidation */}
      <g className="tm-sx-plan">
        <rect
          className="tm-sx-plan-bar tm-sx-plan-entry"
          x={entryX}
          y={sxY(SX_LEVELS.entryHigh)}
          width={zoneWidth}
          height={sxY(SX_LEVELS.entryLow) - sxY(SX_LEVELS.entryHigh)}
        />
        <line
          className="tm-sx-plan-bar tm-sx-plan-line is-target"
          x1={entryX}
          x2={SX.right}
          y1={sxY(SX_LEVELS.target)}
          y2={sxY(SX_LEVELS.target)}
        />
        <line
          className="tm-sx-plan-bar tm-sx-plan-line is-stop"
          x1={entryX}
          x2={SX.right}
          y1={sxY(SX_LEVELS.stop)}
          y2={sxY(SX_LEVELS.stop)}
        />
        <text className="tm-sx-plan-label is-target" x={entryX + 8} y={sxY(SX_LEVELS.target) - 10}>
          TARGET · {sxPrice(SX_LEVELS.target)}
        </text>
        <text className="tm-sx-plan-label is-entry" x={SX.right - 8} y={sxY(SX_LEVELS.entryHigh) - 10} textAnchor="end">
          ENTRY ZONE · {sxPrice(SX_LEVELS.entryLow)}–{sxPrice(SX_LEVELS.entryHigh)}
        </text>
        <text className="tm-sx-plan-label is-stop" x={entryX + 8} y={sxY(SX_LEVELS.stop) + 24}>
          INVALIDATION · {sxPrice(SX_LEVELS.stop)}
        </text>
        <g className="tm-sx-entry-mark">
          <circle cx={entryX} cy={sxY(SX_CLEAN[SX_ENTRY])} r="13" />
          <circle cx={entryX} cy={sxY(SX_CLEAN[SX_ENTRY])} r="5" />
        </g>
      </g>

      {/* 04 — labels sit above the price so they stay legible */}
      <g className="tm-sx-ratio" transform={`translate(${SX.right - 104} ${sxY(SX_LEVELS.entry) - 82})`}>
        <rect x="-92" y="-20" width="184" height="40" rx="20" />
        <text y="5" textAnchor="middle">R:R  3.4 : 1</text>
      </g>
      <text
        className="tm-sx-risk-label is-loss"
        x={zoneCenter}
        y={(sxY(SX_LEVELS.entry) + sxY(SX_LEVELS.stop)) / 2 + 5}
        textAnchor="middle"
      >
        RISK DEFINED · −0.9%
      </text>
      {SX_EVENTS.map((event) => (
        <g key={event.index} className="tm-sx-risk-label tm-sx-event">
          <path d={`M${sxX(event.index)} ${SX.top + 14}l6 6-6 6-6-6z`} />
          <text x={sxX(event.index) + 10} y={SX.bottom - 12}>{event.label}</text>
        </g>
      ))}

      {/* 05 — Review */}
      <g className="tm-sx-done">
        <circle className="tm-sx-done-ring" cx={SX.right} cy={sxY(SX_CLEAN[SX_LAST])} r="20" />
        <text x={SX.right - 4} y={SX.top - 30} textAnchor="end">
          TARGET ZONE MET · VIEW REVIEWED
        </text>
      </g>

      {/* Live cursor riding the tip of the price */}
      <g className="tm-sx-cursor">
        <line className="tm-sx-guide" x1={f.x} x2={SX.axis} y1={f.y} y2={f.y} />
        <g className="tm-sx-tip" transform={`translate(${f.x} ${f.y})`}>
          <circle className="tm-sx-tip-pulse" r="16" />
          <circle className="tm-sx-tip-dot" r="5" />
        </g>
        <g className="tm-sx-tag" transform={`translate(${SX.axis} ${f.y})`}>
          <rect x="0" y="-14" width="112" height="28" rx="4" />
          <text className="tm-sx-tag-text" x="56" y="5" textAnchor="middle">
            {sxPrice(f.price)}
          </text>
        </g>
      </g>
    </svg>
  );
}

function StrategySection({
  activeStage,
  onJump,
}: {
  activeStage: number;
  onJump: (index: number) => void;
}) {
  return (
    <section id="strategy" className="tm-sx" aria-labelledby="strategy-title">
      <div className="tm-sx-stage">
        <div className="tm-sx-backdrop" aria-hidden="true" />

        <div className="tm-container tm-sx-intro">
          <Eyebrow>04 / INSIDE THE STRATEGY</Eyebrow>
          <h2 id="strategy-title">
            One system.<br />
            <span className="tm-gold-text">Five deliberate stages.</span>
          </h2>
          <p>
            Research is not a feeling. It is a sequence — each stage with its own
            inputs, checks and stated limits.
          </p>
          <span className="tm-sx-cue tm-mono" aria-hidden="true">Scroll to run the system</span>
        </div>

        <div className="tm-container tm-sx-layout">
          <ol className="tm-sx-steps">
            {STAGES.map((stage) => (
              <li className="tm-sx-step" key={stage.number}>
                <span className="tm-sx-step-ghost" aria-hidden="true">{stage.number}</span>
                <div className="tm-sx-step-head">
                  <span>{stage.number}</span>
                  <span className="tm-sx-step-rule" aria-hidden="true" />
                  <span>{stage.name}</span>
                </div>
                <h3>{stage.title}</h3>
                <p>{stage.text}</p>
                <span className="tm-sx-step-label tm-mono">{stage.label}</span>
              </li>
            ))}
          </ol>

          <div className="tm-sx-panel">
            <div className="tm-sx-panel-bar">
              <span className="tm-mono tm-sx-ticker">
                <i aria-hidden="true" /> NIFTY 50 · 1D
              </span>
              <span className="tm-mono tm-gold tm-sx-status" aria-live="polite">
                {STAGES[activeStage].signal}
              </span>
              <span className="tm-demo-badge">ILLUSTRATIVE · NOT LIVE</span>
            </div>
            <StrategyChart />
          </div>
        </div>

        <nav className="tm-container tm-sx-hud" aria-label="Research stages">
          <div className="tm-sx-hud-rail">
            <div className="tm-sx-hud-track" aria-hidden="true">
              <div className="tm-sx-hud-fill" />
            </div>
            {STAGES.map((stage, i) => (
              <button
                type="button"
                key={stage.number}
                className={`tm-sx-hud-node ${i <= activeStage ? "is-reached" : ""} ${i === activeStage ? "is-current" : ""}`}
                style={{ "--at": `${(i / (STAGES.length - 1)) * 100}%` } as CSSProperties}
                aria-current={i === activeStage ? "step" : undefined}
                onClick={() => onJump(i)}
              >
                <i aria-hidden="true" />
                <span>{stage.number} {stage.name}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="tm-container">
        <p className="tm-fine-print">
          Trading Monks provides independent equity research under SEBI Research
          Analyst registration. It does not execute trades or manage client capital.
          Chart is illustrative and does not represent a past or future recommendation.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 05 — Governance seal: a guilloché certificate drawn by scroll              */
/* -------------------------------------------------------------------------- */

const GV_STATS = [
  {
    value: 10,
    suffix: "+",
    tag: "EXPERIENCE",
    title: "Years of market analysis",
    text: "Market behaviour, price dynamics, institutional volume and structural cycles.",
  },
  {
    value: 3,
    suffix: "",
    tag: "METHODOLOGY",
    title: "Integrated research lenses",
    text: "Technical structure, business fundamentals and explicit risk boundaries.",
  },
  {
    value: 5,
    suffix: "",
    tag: "REGULATORY",
    title: "Year registration validity",
    text: "Granted by SEBI through 15 February 2031 under the RA Regulations.",
  },
];

const GV_LENSES = [
  {
    name: "TECHNICAL",
    angle: 0,
    title: "Technical Structure",
    text: "Support, resistance, consolidation, trend strength, breakout geometry, momentum and volume delta.",
  },
  {
    name: "FUNDAMENTAL",
    angle: 120,
    title: "Business Fundamentals",
    text: "Earnings trajectory, revenue quality, balance-sheet strength, governance and competitive position.",
  },
  {
    name: "RISK",
    angle: 240,
    title: "Risk Controls",
    text: "Downside exposure, invalidation levels, volatility parameters, liquidity and event risk stated upfront.",
  },
];

const GV_YEARS = [2026, 2027, 2028, 2029, 2030, 2031];
const GV_ARC = { start: -150, sweep: 300, r: 222 };
const GV_LENS_OFFSET = 50;
const GV_RING_TEXT = `SEBI REGISTERED RESEARCH ANALYST · ${CONTACT.registration} · ${CONTACT.name.toUpperCase()} · NEW DELHI · INDIA · `;

/* Degrees run clockwise from twelve o'clock; output rounded so SSR matches the browser */
const gvRound = (n: number) => Math.round(n * 10) / 10;
const gvPolar = (r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [gvRound(r * Math.sin(a)), gvRound(-r * Math.cos(a))];
};
const gvPath = (points: [number, number][]) =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join("") + "Z";

/* Banknote braid: four phase-shifted sine waves wrapped around a ring */
const GV_BAND = [0, 1, 2, 3].map((k) =>
  gvPath(
    Array.from({ length: 720 }, (_, i) => {
      const deg = i / 2;
      return gvPolar(265 + 14 * Math.sin((deg * Math.PI) / 5 + (k * Math.PI) / 2), deg);
    }),
  ),
);

/* Hypotrochoid rosette (R 8, r 5, d 5) — the classic spirograph lathe pattern */
const GV_ROSETTE = gvPath(
  Array.from({ length: 900 }, (_, i) => {
    const t = (i / 900) * Math.PI * 10;
    return [
      gvRound((3 * Math.cos(t) + 5 * Math.cos(0.6 * t)) * 8.6),
      gvRound((3 * Math.sin(t) - 5 * Math.sin(0.6 * t)) * 8.6),
    ];
  }),
);

const gvArcDeg = (fraction: number) => GV_ARC.start + GV_ARC.sweep * fraction;
const GV_VALIDITY = (() => {
  const [sx, sy] = gvPolar(GV_ARC.r, GV_ARC.start);
  const [ex, ey] = gvPolar(GV_ARC.r, GV_ARC.start + GV_ARC.sweep);
  return `M${sx} ${sy}A${GV_ARC.r} ${GV_ARC.r} 0 1 1 ${ex} ${ey}`;
})();

function GovernanceSeal() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <svg
      className="tm-gv-seal"
      viewBox="-300 -300 600 600"
      role="img"
      aria-label={`SEBI registration seal for ${CONTACT.name}, registration ${CONTACT.registration}, valid ${CONTACT.validity}.`}
    >
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#d6b574" stopOpacity="0.16" />
          <stop offset="1" stopColor="#d6b574" stopOpacity="0" />
        </radialGradient>
        <path id={`${id}-ring`} d="M0 -174A174 174 0 1 1 0 174A174 174 0 1 1 0 -174" />
      </defs>

      <circle r="296" fill={`url(#${id}-glow)`} />

      <g className="tm-gv-body">
        {/* Hairline frame */}
        {[290, 240].map((r) => (
          <circle key={r} className="tm-gv-hair" r={r} pathLength="1" />
        ))}
        <circle className="tm-gv-dash" r="158" />

        {/* 01 — braided security band */}
        <g className="tm-gv-band">
          {GV_BAND.map((d, k) => (
            <path key={k} d={d} pathLength="1" />
          ))}
        </g>

        {/* Registration text orbiting the seal */}
        <g className="tm-gv-ring">
          <g className="tm-gv-spin">
            <text>
              <textPath href={`#${id}-ring`} textLength="1080" lengthAdjust="spacing">
                {GV_RING_TEXT}
              </textPath>
            </text>
          </g>
        </g>

        {/* 03 — validity bezel: one tick per month, five years */}
        <g className="tm-gv-validity">
          <path className="tm-gv-track" d={GV_VALIDITY} />
          {Array.from({ length: 61 }, (_, m) => {
            const year = m % 12 === 0;
            const [x1, y1] = gvPolar(230, gvArcDeg(m / 60));
            const [x2, y2] = gvPolar(year ? 238 : 234, gvArcDeg(m / 60));
            return <line key={m} className={`tm-gv-tick ${year ? "is-year" : ""}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
          <path className="tm-gv-fill" d={GV_VALIDITY} pathLength="1" />
          {GV_YEARS.map((year, i) => {
            const [x, y] = gvPolar(206, gvArcDeg(i / 5));
            return (
              <text key={year} className="tm-gv-year" x={x} y={y + 4} textAnchor="middle">
                {year}
              </text>
            );
          })}
          <text className="tm-gv-valid" x="0" y="232" textAnchor="middle">
            VALID THROUGH 15 · 02 · 2031
          </text>
        </g>

        {/* 02 — three research lenses */}
        {GV_LENSES.map((lens) => {
          const [cx, cy] = gvPolar(GV_LENS_OFFSET, lens.angle);
          const [lx, ly] = gvPolar(140, lens.angle);
          return (
            <g key={lens.name} className="tm-gv-lens">
              <g transform={`translate(${cx} ${cy})`}>
                <circle className="tm-gv-lens-ring" r="72" pathLength="1" />
                <path className="tm-gv-rosette" d={GV_ROSETTE} pathLength="1" />
              </g>
              <text className="tm-gv-lens-label" x={lx} y={ly + 4} textAnchor="middle">
                {lens.name}
              </text>
            </g>
          );
        })}

        {/* Verified — stamped last */}
        <g className="tm-gv-check">
          <circle className="tm-gv-flash" r="30" />
          <circle className="tm-gv-check-disc" r="30" />
          <path className="tm-gv-check-mark" d="M-12 1l8 8 16-17" pathLength="1" />
        </g>
      </g>
    </svg>
  );
}

function LensGlyph({ active }: { active: number }) {
  return (
    <svg className="tm-gv-glyph" viewBox="-30 -30 60 60" aria-hidden="true">
      {GV_LENSES.map((lens, i) => {
        const [cx, cy] = gvPolar(9, lens.angle);
        return <circle key={lens.name} cx={cx} cy={cy} r="13" className={i === active ? "is-active" : ""} />;
      })}
    </svg>
  );
}

function GovernanceSection() {
  return (
    <section id="edge" className="tm-gv" aria-labelledby="edge-title">
      <div className="tm-gv-stage">
        <div className="tm-container tm-gv-layout">
          <div className="tm-gv-copy-col">
            <div className="tm-gv-meta">
              <Eyebrow>05 / GOVERNANCE &amp; RESEARCH INTEGRITY</Eyebrow>
              <span className="tm-gv-chip">
                <span className="tm-pulse-dot" aria-hidden="true" />
                SEBI REGISTERED · {CONTACT.registration}
              </span>
            </div>

            <h2 id="edge-title" className="tm-gv-title">
              <span className="tm-gv-line"><span>Trust isn&apos;t a</span></span>
              <span className="tm-gv-line"><span>visual effect.</span></span>
              <span className="tm-gv-line tm-gold-text"><span>It&apos;s earned.</span></span>
            </h2>

            <p className="tm-gv-copy">
              We don&apos;t publish a decorative performance curve, because a retrospective
              chart is a promise no analyst can make. What we can show is who is behind
              the research, how it is regulated, and how every view is structured.
            </p>

            <div className="tm-gv-stats">
              {GV_STATS.map((stat) => (
                <div className="tm-gv-stat" key={stat.tag}>
                  <span className="tm-mono tm-gv-stat-tag">{stat.tag}</span>
                  <strong>
                    <span className="tm-gv-count" data-value={stat.value}>{stat.value}</span>
                    {stat.suffix}
                  </strong>
                  <h3>{stat.title}</h3>
                  <p>{stat.text}</p>
                </div>
              ))}
            </div>

            <a
              className="tm-text-link tm-gv-verify"
              href="https://www.sebi.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Verify on the SEBI official portal <Arrow diagonal />
            </a>
          </div>

          <div className="tm-gv-seal-col">
            <GovernanceSeal />
          </div>
        </div>
      </div>

      <div className="tm-container tm-gv-record">
        {/* The registration, set out like a certificate */}
        <article className="tm-gv-cert tm-gv-reveal" aria-labelledby="gv-cert-title">
          <svg className="tm-gv-watermark" viewBox="-300 -300 600 600" aria-hidden="true">
            {GV_BAND.map((d, k) => (
              <path key={k} d={d} />
            ))}
            <path d={GV_ROSETTE} transform="scale(2.4)" />
          </svg>

          <header className="tm-gv-cert-head">
            <div>
              <span className="tm-mono tm-gold">OFFICIAL REGISTRATION DOSSIER</span>
              <h3 id="gv-cert-title">SEBI Registered Research Analyst</h3>
            </div>
            <span className="tm-gv-chip is-solid">
              <span className="tm-pulse-dot" aria-hidden="true" />
              ACTIVE · INDIVIDUAL
            </span>
          </header>

          <dl className="tm-gv-ledger">
            <div>
              <dt className="tm-mono">Registered name</dt>
              <dd>{CONTACT.name}</dd>
            </div>
            <div>
              <dt className="tm-mono">Registration category</dt>
              <dd>Individual Research Analyst</dd>
            </div>
            <div>
              <dt className="tm-mono">Registration number</dt>
              <dd className="tm-gold">{CONTACT.registration}</dd>
            </div>
            <div>
              <dt className="tm-mono">Validity period</dt>
              <dd>{CONTACT.validity}</dd>
            </div>
            <div>
              <dt className="tm-mono">Registered address</dt>
              <dd>{CONTACT.address}</dd>
            </div>
            <div>
              <dt className="tm-mono">SEBI head office</dt>
              <dd>SEBI Bhavan, Plot No. C4-A, &apos;G&apos; Block, BKC, Bandra (E), Mumbai – 400 051</dd>
            </div>
          </dl>

          <footer className="tm-gv-cert-foot">
            <span className="tm-mono">Registration details can be independently verified with SEBI.</span>
            <a
              className="tm-button tm-button-ghost"
              href="https://www.sebi.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Verify credential</span>
              <Arrow diagonal />
            </a>
          </footer>
        </article>

        <div className="tm-gv-columns">
          <div className="tm-gv-panel tm-gv-reveal">
            <span className="tm-mono tm-gold">CAPABILITIES</span>
            <h3>Three-tier research framework</h3>
            <ol className="tm-gv-lenses">
              {GV_LENSES.map((lens, i) => (
                <li key={lens.name}>
                  <LensGlyph active={i} />
                  <div>
                    <h4>
                      <span className="tm-mono">0{i + 1}</span> {lens.title}
                    </h4>
                    <p>{lens.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="tm-gv-panel tm-gv-reveal">
            <span className="tm-mono tm-gold">STATUTORY</span>
            <h3>Regulatory &amp; risk disclosures</h3>
            <div className="tm-disclosures-accordion">
              <details className="tm-disclosure" open>
                <summary>
                  <span>Market Risk Disclosure</span>
                  <i className="tm-disclosure-arrow">+</i>
                </summary>
                <p>
                  Investments in securities market are subject to market risks. Read all
                  the related documents carefully before investing. Registration does not assure returns.
                </p>
              </details>

              <details className="tm-disclosure">
                <summary>
                  <span>Registration & Performance Notice</span>
                  <i className="tm-disclosure-arrow">+</i>
                </summary>
                <p>
                  Registration granted by SEBI and certification from NISM in no way guarantee
                  performance of the research analyst or provide any assurance of returns to investors.
                </p>
              </details>

              <details className="tm-disclosure">
                <summary>
                  <span>Informational & Research Standard</span>
                  <i className="tm-disclosure-arrow">+</i>
                </summary>
                <p>
                  This platform is dedicated strictly to independent equity research and education.
                  Charts and values are illustrative models, not portfolio management or guaranteed trade execution.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 06 — Contact form                                                          */
/* -------------------------------------------------------------------------- */

type FormStatus = "idle" | "sending" | "sent" | "fallback";

function ContactForm({
  inquiry,
  onInquiryChange,
}: {
  inquiry: string;
  onInquiryChange: (value: string) => void;
}) {
  const id = useId();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fallbackHref, setFallbackHref] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim() || data.name || "Inquirer";
    data.name = fullName;
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus("sent");
      form.reset();
    } catch {
      const subject = encodeURIComponent(`[${data.inquiry || "Inquiry"}] ${fullName} — Trading Monks`);
      const body = encodeURIComponent(
        `${data.message}\n\n—\n${fullName}\n${data.email}\n${data.company || ""}`,
      );
      setFallbackHref(`mailto:${CONTACT.email}?subject=${subject}&body=${body}`);
      setStatus("fallback");
    }
  }

  if (status === "sent") {
    return (
      <div className="tm-form-success-card" role="status">
        <Emblem className="tm-form-success-emblem" metallic />
        <h3>Thank you.</h3>
        <p>Your message has been received. We will reply as soon as possible.</p>
        <button
          type="button"
          className="tm-button tm-contact-submit-btn"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className={`tm-card-form ${status === "sending" ? "is-sending" : ""}`} onSubmit={onSubmit}>
      <div>
        <span className="tm-mono tm-gold">PRIVATE INQUIRY</span>
        <h3 className="tm-form-header-title">Contact Us</h3>
      </div>

      <div className="tm-card-form-grid">
        {/* Row 1: First Name & Last Name */}
        <div className="tm-field-wrap">
          <input
            id={`${id}-firstName`}
            name="firstName"
            type="text"
            required
            placeholder="First Name"
            className="tm-input-clean"
            autoComplete="given-name"
          />
          <span className="tm-field-glow-line" />
        </div>

        <div className="tm-field-wrap">
          <input
            id={`${id}-lastName`}
            name="lastName"
            type="text"
            required
            placeholder="Last Name"
            className="tm-input-clean"
            autoComplete="family-name"
          />
          <span className="tm-field-glow-line" />
        </div>

        {/* Row 2: Postal Code / Company & Email Address */}
        <div className="tm-field-wrap">
          <input
            id={`${id}-company`}
            name="company"
            type="text"
            placeholder="Postal Code / Company"
            className="tm-input-clean"
            autoComplete="organization"
          />
          <span className="tm-field-glow-line" />
        </div>

        <div className="tm-field-wrap">
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            placeholder="Email Address"
            className="tm-input-clean"
            autoComplete="email"
          />
          <span className="tm-field-glow-line" />
        </div>

        {/* Row 3: Inquiry Type */}
        <div className="tm-field-wrap tm-field-full">
          <select
            id={`${id}-inquiry`}
            name="inquiry"
            value={inquiry}
            onChange={(event) => onInquiryChange(event.target.value)}
            className="tm-input-clean tm-select-clean"
          >
            {INQUIRY_TYPES.map((type) => (
              <option key={type} value={type} className="tm-opt-dark">{type}</option>
            ))}
          </select>
          <span className="tm-field-glow-line" />
        </div>

        {/* Row 4: Message */}
        <div className="tm-field-wrap tm-field-full">
          <textarea
            id={`${id}-message`}
            name="message"
            rows={3}
            required
            placeholder="Message"
            className="tm-input-clean tm-textarea-clean"
          />
          <span className="tm-field-glow-line" />
        </div>
      </div>

      <div className="tm-form-bottom-bar">
        <button
          type="submit"
          className="tm-button tm-contact-submit-btn"
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <span className="tm-btn-loading">
              <span className="tm-dot-pulse" />
              <span>Sending…</span>
            </span>
          ) : (
            <span>Submit</span>
          )}
        </button>

        <span className="tm-statutory-micro">
          SEBI: {CONTACT.registration} • No trade advice via this form
        </span>
      </div>

      {status === "fallback" && (
        <div className="tm-form-fallback" role="alert">
          We couldn&apos;t deliver this automatically.{" "}
          <a href={fallbackHref}>Click here to open email draft directly</a> or write to {CONTACT.email}.
        </div>
      )}
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [inquiry, setInquiry] = useState(INQUIRY_TYPES[0]);
  const moreRef = useRef<HTMLDivElement>(null);
  const [motionPaused, setMotionPaused] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [landingPageArrived, setLandingPageArrived] = useState(false);
  const [heroAnimationStarted, setHeroAnimationStarted] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const strategyTimelineRef = useRef<gsap.core.Timeline | null>(null);

  /* Rail buttons scroll to the moment each stage is fully on screen */
  function jumpToStage(index: number) {
    const trigger = strategyTimelineRef.current?.scrollTrigger;
    if (!trigger) return;
    window.scrollTo({ top: trigger.labelToScroll(`stage-${index}`) + 2, behavior: "smooth" });
  }

  /* If loader is not rendered on mount, mark landing page as arrived immediately */
  useEffect(() => {
    if (!showLoader && !landingPageArrived) {
      setLandingPageArrived(true);
    }
  }, [showLoader, landingPageArrived]);

  /* Wait 1 second on the landing page showing pure 4K artwork before triggering dark layer and SplitText */
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHeroAnimationStarted(true);
      return;
    }
    if (!landingPageArrived) {
      setHeroAnimationStarted(false);
      return;
    }
    const timer = setTimeout(() => {
      setHeroAnimationStarted(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [landingPageArrived]);

  /* Scroll choreography */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const media = gsap.matchMedia();

    const context = gsap.context(() => {
      if (motionPaused) return;

      /* ---- Everything with motion allowed ---- */
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".tm-reveal", root).forEach((el) => {
          gsap.from(el, {
            y: 34,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });

        gsap.to(".tm-scroll-progress", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.2 },
        });

        /* 01 → 02: hero facets become the chart grid */
        gsap.fromTo(
          ".tm-hero-facets",
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: ".tm-hero", start: "40% top", end: "bottom top", scrub: true },
          },
        );
        gsap.to(".tm-hero-layout", {
          opacity: 0,
          y: -60,
          ease: "none",
          scrollTrigger: { trigger: ".tm-hero", start: "top top", end: "bottom top", scrub: true },
        });

        /* 03: kinetic words + emblem line-draw */

        /* 05: restrained number counters + subtle scroll parallax */
        gsap.utils.toArray<HTMLElement>(".tm-count", root).forEach((el) => {
          const value = Number(el.dataset.value || el.textContent || 0);
          gsap.from(el, {
            textContent: 0,
            snap: { textContent: 1 },
            duration: 1.4,
            ease: "power2.out",
            onUpdate() {
              el.textContent = String(Math.round(Number(el.textContent)));
            },
            onComplete() {
              el.textContent = String(value);
            },
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });

        /* 06: emblem recedes while the form emerges */
        gsap.to(".tm-contact-emblem", {
          scale: 0.72,
          opacity: 0.35,
          x: "-10%",
          ease: "none",
          scrollTrigger: { trigger: ".tm-contact", start: "top 60%", end: "center 40%", scrub: 0.8 },
        });

        /* 07: gold line draws, logo settles */
        gsap.from(".tm-footer-line", {
          scaleX: 0,
          duration: 1.4,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".tm-footer", start: "top 85%", once: true },
        });
        gsap.from(".tm-footer-top", {
          opacity: 0,
          y: 20,
          duration: 1,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: ".tm-footer", start: "top 85%", once: true },
        });
      });

      /* ---- Desktop-only pinned sequences ---- */
      media.add(
        "(min-width: 1000px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)",
        () => {
          /* 02 — camera moves through the market */
          const marketStage = root.querySelector<HTMLElement>(".tm-market-stage");
          if (marketStage) {
            const candles = gsap.utils.toArray<SVGGElement>(".tm-m-candle", marketStage);
            const highlights = gsap.utils.toArray<SVGGElement>(".tm-m-highlight", marketStage);
            const concepts = gsap.utils.toArray<HTMLElement>(".tm-m-concept", marketStage);

            gsap.set(candles, { scaleY: 0, transformOrigin: "50% 100%" });
            gsap.set(highlights, { opacity: 0 });
            gsap.set(concepts, { opacity: 0, y: 24 });

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: marketStage,
                start: "top top",
                end: "+=2600",
                pin: true,
                scrub: 0.7,
                anticipatePin: 1,
              },
            });

            tl.to(candles, { scaleY: 1, stagger: 0.045, duration: 1, ease: "power2.out" }, 0)
              .to(".tm-m-world", { x: -380, scale: 1.12, transformOrigin: "50% 60%", duration: 4.2, ease: "none" }, 0)
              .to(".tm-market-heading", { opacity: 0.08, duration: 0.8 }, 0.6);

            concepts.forEach((concept, i) => {
              const at = 0.9 + i * 1.1;
              tl.to(highlights[i], { opacity: 1, duration: 0.3 }, at)
                .to(concept, { opacity: 1, y: 0, duration: 0.4 }, at);
              if (i < concepts.length - 1) {
                tl.to(concept, { opacity: 0, y: -16, duration: 0.3 }, at + 0.85);
              }
            });

            /* chart converges cleanly */
            tl.to(".tm-m-world", { opacity: 0.75, duration: 0.6 }, 4.4)
              .to({}, { duration: 0.3 });
          }

          /* 03 — The Monk's Philosophy: interactive scroll-draw logo */
          const phSection = root.querySelector<HTMLElement>(".tm-philosophy");
          if (phSection) {
            const phPaths = gsap.utils.toArray<SVGPathElement>(".tm-ph-emblem .tm-emblem-path", phSection);
            const phCards = gsap.utils.toArray<HTMLElement>(".tm-ph-principle", phSection);
            const phDetails = phSection.querySelectorAll(
              ".tm-ph-emblem .tm-emblem-visor, .tm-ph-emblem .tm-emblem-dot, .tm-ph-emblem .tm-emblem-wedge",
            );

            gsap.set(phPaths, { strokeDasharray: 1, strokeDashoffset: 1 });
            gsap.set(phDetails, { opacity: 0 });
            gsap.set(phCards, { x: 48, opacity: 0 });

            const phTl = gsap.timeline({
              scrollTrigger: {
                trigger: phSection,
                start: "top top",
                end: "+=1800",
                pin: true,
                scrub: 0.7,
                anticipatePin: 1,
              },
            });

            // 1. Kinetic title words reveal
            phTl.fromTo(
              ".tm-ph-word > span",
              { yPercent: 110 },
              { yPercent: 0, stagger: 0.08, duration: 0.7, ease: "power3.out" },
              0,
            );

            // 2. Principle cards slide in toward the emblem as it draws
            phTl.to(
              phCards,
              { x: 0, opacity: 1, stagger: 0.18, duration: 0.85, ease: "power2.out" },
              0.6,
            );

            // 3. Logo visor, dots and shoulder wedge emerge as the lines complete
            phTl.to(
              phDetails,
              { opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" },
              1.2,
            );

            // 4. Hold so user enjoys the completed logo before unpinning
            phTl.to({}, { duration: 0.6 });

            // The facets start engraving as the section arrives, so the centre is
            // never empty, and finish half-way through the pin
            // (a timeline, not a lone tween, so pausing motion reverts it cleanly)
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: phSection,
                  start: "top 75%",
                  end: () => `+=${window.innerHeight * 0.75 + 900}`,
                  scrub: 0.6,
                },
              })
              .to(phPaths, { strokeDashoffset: 0, stagger: 0.04, ease: "power1.inOut" });
          }

          /* 04 — one chart runs the whole system: noise → structure → plan → outcome */
          const strategy = root.querySelector<HTMLElement>(".tm-sx");
          const strategySvg = strategy?.querySelector<SVGSVGElement>(".tm-sx-svg");
          if (strategy && strategySvg) {
            strategy.classList.add("is-scrolly");
            const q = gsap.utils.selector(strategy);
            const frame: StrategyFrame = { reveal: 0, noise: 1 };
            const paint = () => paintStrategyChart(strategySvg, frame);
            paint();

            const stepParts = gsap.utils
              .toArray<HTMLElement>(".tm-sx-step", strategy)
              .map((step) => Array.from(step.children));
            const at = { observe: 1, validate: 3.8, structure: 5.4, risk: 7, review: 8.6 };
            const starts = Object.values(at);

            gsap.set(q(".tm-sx-panel"), {
              rotateX: 28,
              y: 140,
              scale: 0.84,
              opacity: 0.2,
              transformPerspective: 1600,
              transformOrigin: "50% 100%",
            });
            gsap.set(stepParts.flat(), { autoAlpha: 0, y: 32, filter: "blur(8px)" });
            gsap.set(q(".tm-sx-hud"), { autoAlpha: 0, y: 24 });
            gsap.set(q(".tm-sx-hud-fill"), { scaleX: 0 });
            gsap.set(
              q(".tm-sx-grid, .tm-sx-cursor, .tm-sx-area, .tm-sx-accum, .tm-sx-level-label, .tm-sx-plan-label, .tm-sx-risk-label, .tm-sx-done"),
              { opacity: 0 },
            );
            gsap.set(q(".tm-sx-line"), { color: "rgba(245, 241, 232, 0.5)" });
            gsap.set(q(".tm-sx-level-line, .tm-sx-plan-bar"), { scaleX: 0, transformOrigin: "0% 50%" });
            gsap.set(q(".tm-sx-touch, .tm-sx-entry-mark, .tm-sx-ratio, .tm-sx-done-ring"), {
              scale: 0,
              transformOrigin: "50% 50%",
            });
            gsap.set(q(".tm-sx-bar, .tm-sx-reward, .tm-sx-event-line"), { scaleY: 0, transformOrigin: "50% 100%" });
            gsap.set(q(".tm-sx-loss"), { scaleY: 0, transformOrigin: "50% 0%" });
            gsap.set(q(".tm-sx-vol-ma"), { strokeDasharray: 1, strokeDashoffset: 1 });

            const tl = gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: {
                trigger: q(".tm-sx-stage")[0],
                start: "top top",
                end: () => `+=${window.innerHeight * 5.5}`,
                pin: true,
                scrub: 0.9,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });
            strategyTimelineRef.current = tl;

            let current = -1;
            tl.eventCallback("onUpdate", () => {
              const time = tl.time();
              const index = starts.reduce((found, start, i) => (time >= start - 0.3 ? i : found), 0);
              if (index !== current) {
                current = index;
                setActiveStage(index);
              }
            });

            /* Intro: the headline dissolves while the chart rises flat */
            tl.to(q(".tm-sx-intro"), { autoAlpha: 0, scale: 0.92, y: -40, filter: "blur(12px)", duration: 0.8, ease: "power2.in" }, 0.1)
              .to(q(".tm-sx-panel"), { rotateX: 0, y: 0, scale: 1, opacity: 1, duration: 1.1, ease: "power3.out" }, 0.2)
              .to(q(".tm-sx-grid"), { opacity: 1, duration: 0.6 }, 0.6)
              .to(q(".tm-sx-hud"), { autoAlpha: 1, y: 0, duration: 0.5 }, 0.8);

            /* Copy for each stage blurs in, then hands over to the next */
            stepParts.forEach((parts, i) => {
              tl.addLabel(`stage-${i}`, starts[i] + 0.6).to(
                parts,
                { autoAlpha: 1, y: 0, filter: "blur(0px)", stagger: 0.06, duration: 0.5 },
                starts[i],
              );
              if (i < stepParts.length - 1) {
                tl.to(
                  parts,
                  { autoAlpha: 0, y: -24, filter: "blur(6px)", stagger: 0.03, duration: 0.3, ease: "power2.in" },
                  starts[i + 1] - 0.35,
                ).to(
                  q(".tm-sx-hud-fill"),
                  { scaleX: (i + 1) / (stepParts.length - 1), duration: starts[i + 1] - starts[i], ease: "none" },
                  starts[i],
                );
              }
            });

            /* 01 Observe — chaos draws in, then the noise is removed */
            tl.to(q(".tm-sx-cursor"), { opacity: 1, duration: 0.2 }, at.observe)
              .to(frame, { reveal: SX_NOW, duration: 1.4, ease: "none", onUpdate: paint }, at.observe)
              .to(frame, { noise: 0, duration: 0.9, ease: "power2.inOut", onUpdate: paint }, at.observe + 1.5)
              .to(q(".tm-sx-line"), { color: "#d6b574", duration: 0.9 }, at.observe + 1.5)
              .to(q(".tm-sx-area"), { opacity: 1, duration: 0.9 }, at.observe + 1.6)
              .to(q(".tm-sx-level-line"), { scaleX: 1, duration: 0.7, stagger: 0.12, ease: "power3.inOut" }, at.observe + 1.7)
              .to(q(".tm-sx-level-label"), { opacity: 1, duration: 0.4, stagger: 0.12 }, at.observe + 2.1)
              .to(q(".tm-sx-touch"), { scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(2.5)" }, at.observe + 2.2);

            /* 02 Validate — participation builds underneath the price */
            tl.to(q(".tm-sx-bar"), { scaleY: 1, duration: 0.5, stagger: 0.012, ease: "power3.out" }, at.validate + 0.1)
              .to(q(".tm-sx-vol-ma"), { strokeDashoffset: 0, duration: 0.8, ease: "none" }, at.validate + 0.4)
              .to(q(".tm-sx-accum"), { opacity: 1, duration: 0.4 }, at.validate + 0.9);

            /* 03 Structure — entry, target and invalidation are drawn */
            tl.to(q(".tm-sx-levels"), { opacity: 0.35, duration: 0.4 }, at.structure)
              .to(q(".tm-sx-entry-mark"), { scale: 1, duration: 0.35, ease: "back.out(2.5)" }, at.structure + 0.1)
              .to(q(".tm-sx-plan-bar"), { scaleX: 1, duration: 0.7, stagger: 0.15, ease: "power3.inOut" }, at.structure + 0.25)
              .to(q(".tm-sx-plan-label"), { opacity: 1, duration: 0.4, stagger: 0.12 }, at.structure + 0.7);

            /* 04 Define risk — exposure is shaded, events are mapped */
            tl.to(q(".tm-sx-reward"), { scaleY: 1, duration: 0.7, ease: "power3.out" }, at.risk + 0.1)
              .to(q(".tm-sx-loss"), { scaleY: 1, duration: 0.5, ease: "power3.out" }, at.risk + 0.1)
              .to(q(".tm-sx-ratio"), { scale: 1, duration: 0.4, ease: "back.out(2)" }, at.risk + 0.6)
              .to(q(".tm-sx-event-line"), { scaleY: 1, duration: 0.5, stagger: 0.15, ease: "power2.inOut" }, at.risk + 0.7)
              .to(q(".tm-sx-risk-label"), { opacity: 1, duration: 0.4, stagger: 0.1 }, at.risk + 0.9);

            /* 05 Review — the view plays out against its stated parameters */
            tl.to(q(".tm-sx-risk"), { opacity: 0.45, duration: 0.4 }, at.review)
              .to(frame, { reveal: SX_LAST, duration: 1.5, ease: "power1.inOut", onUpdate: paint }, at.review + 0.2)
              .to(q(".tm-sx-done"), { opacity: 1, duration: 0.4 }, at.review + 1.7)
              .to(q(".tm-sx-done-ring"), { scale: 1, duration: 0.4, ease: "back.out(2)" }, at.review + 1.7)
              .to({}, { duration: 0.4 });
          }

          /* 05 — the seal is engraved line by line while its numbers count up */
          const governance = root.querySelector<HTMLElement>(".tm-gv");
          const counts = governance
            ? gsap.utils.toArray<HTMLElement>(".tm-gv-count", governance)
            : [];
          if (governance) {
            const q = gsap.utils.selector(governance);
            const stats = q(".tm-gv-stat");
            const lenses = q(".tm-gv-lens");
            const center = { transformOrigin: "50% 50%" };

            counts.forEach((el) => (el.textContent = "0"));
            gsap.set(q(".tm-gv-line > span"), { yPercent: 110 });
            gsap.set(q(".tm-gv-copy, .tm-gv-verify, .tm-gv-meta"), { autoAlpha: 0, y: 24 });
            gsap.set(stats, { autoAlpha: 0.25, y: 16 });
            gsap.set(q(".tm-gv-seal"), { scale: 0.82, rotation: -24, ...center });
            gsap.set(
              q(".tm-gv-hair, .tm-gv-band path, .tm-gv-fill, .tm-gv-lens-ring, .tm-gv-rosette, .tm-gv-check-mark"),
              { strokeDasharray: 1, strokeDashoffset: 1 },
            );
            gsap.set(q(".tm-gv-band"), { rotation: -40, ...center });
            gsap.set(q(".tm-gv-ring"), { autoAlpha: 0, rotation: -70, ...center });
            gsap.set(q(".tm-gv-dash, .tm-gv-track, .tm-gv-tick, .tm-gv-lens-label, .tm-gv-valid"), { autoAlpha: 0 });
            gsap.set(q(".tm-gv-year"), { autoAlpha: 0.15 });
            gsap.set(q(".tm-gv-check"), { scale: 0, ...center });
            gsap.set(q(".tm-gv-flash"), { scale: 1, autoAlpha: 0, ...center });

            const tl = gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: {
                trigger: q(".tm-gv-stage")[0],
                start: "top top",
                end: () => `+=${window.innerHeight * 3.2}`,
                pin: true,
                scrub: 0.8,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            const count = (index: number, at: number, duration: number) => {
              const el = counts[index];
              const target = Number(el?.dataset.value ?? 0);
              const value = { n: 0 };
              tl.to(stats[index], { autoAlpha: 1, y: 0, duration: 0.4 }, at).to(
                value,
                {
                  n: target,
                  duration,
                  ease: "power1.out",
                  onUpdate: () => {
                    if (el) el.textContent = String(Math.round(value.n));
                  },
                },
                at,
              );
            };

            /* Statement rises; the seal settles into place */
            tl.to(q(".tm-gv-meta"), { autoAlpha: 1, y: 0, duration: 0.4 }, 0)
              .to(q(".tm-gv-line > span"), { yPercent: 0, stagger: 0.12, duration: 0.7, ease: "power3.out" }, 0)
              .to(q(".tm-gv-copy, .tm-gv-verify"), { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.5 }, 0.5)
              .to(q(".tm-gv-seal"), { scale: 1, rotation: 0, duration: 3.6, ease: "power2.out" }, 0)
              .to(q(".tm-gv-hair"), { strokeDashoffset: 0, stagger: 0.15, duration: 0.9, ease: "power1.inOut" }, 0);

            /* 01 — the braided band engraves itself (experience) */
            tl.to(q(".tm-gv-band path"), { strokeDashoffset: 0, stagger: 0.14, duration: 1.2, ease: "power1.inOut" }, 0.2)
              .to(q(".tm-gv-band"), { rotation: 0, duration: 1.6, ease: "power2.out" }, 0.2);
            count(0, 0.8, 0.9);

            /* Registration text swings into orbit */
            tl.to(q(".tm-gv-ring"), { autoAlpha: 1, rotation: 0, duration: 1.1, ease: "power3.out" }, 1)
              .to(q(".tm-gv-dash"), { autoAlpha: 1, duration: 0.6 }, 1.2);

            /* 02 — three lenses are turned, one after another */
            lenses.forEach((lens, i) => {
              const at = 1.5 + i * 0.3;
              tl.to(lens.querySelectorAll(".tm-gv-lens-ring, .tm-gv-rosette"), {
                strokeDashoffset: 0,
                stagger: 0.1,
                duration: 0.9,
                ease: "power1.inOut",
              }, at).to(lens.querySelector(".tm-gv-lens-label"), { autoAlpha: 1, duration: 0.3 }, at + 0.5);
            });
            count(1, 1.6, 0.9);

            /* 03 — validity runs February 2026 → February 2031 */
            tl.to(q(".tm-gv-track, .tm-gv-tick"), { autoAlpha: 1, duration: 0.3, stagger: 0.004 }, 2.5)
              .to(q(".tm-gv-fill"), { strokeDashoffset: 0, duration: 1.2, ease: "none" }, 2.7)
              .to(q(".tm-gv-year"), { autoAlpha: 1, duration: 0.15, stagger: 0.21 }, 2.7)
              .to(q(".tm-gv-valid"), { autoAlpha: 1, duration: 0.3 }, 3.8);
            count(2, 2.7, 1.2);

            /* Verified — the stamp lands */
            tl.to(q(".tm-gv-check"), { scale: 1, duration: 0.45, ease: "back.out(2.2)" }, 4)
              .to(q(".tm-gv-check-mark"), { strokeDashoffset: 0, duration: 0.35, ease: "power2.inOut" }, 4.2)
              .to(q(".tm-gv-flash"), { keyframes: [{ autoAlpha: 0.7, duration: 0.05 }, { scale: 5, autoAlpha: 0, duration: 0.6 }] }, 4.2)
              .to({}, { duration: 0.5 });

            /* The record below rises in once the seal is complete */
            q(".tm-gv-reveal").forEach((el) => {
              gsap.from(el, {
                y: 40,
                autoAlpha: 0,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              });
            });
          }

          return () => {
            counts.forEach((el) => (el.textContent = el.dataset.value ?? ""));
            strategy?.classList.remove("is-scrolly");
            if (strategySvg) paintStrategyChart(strategySvg, SX_FINAL);
            strategyTimelineRef.current = null;
            setActiveStage(STAGES.length - 1);
          };
        },
      );

      /* Without the pinned sequence, treat every stage as reached */
      media.add("(max-width: 999px), (max-height: 679px), (prefers-reduced-motion: reduce)", () => {
        setActiveStage(STAGES.length - 1);
        gsap.set(".tm-ph-emblem .tm-emblem-path", { strokeDashoffset: 0 });
        gsap.set(
          ".tm-ph-emblem .tm-emblem-visor, .tm-ph-emblem .tm-emblem-dot, .tm-ph-emblem .tm-emblem-wedge",
          { opacity: 1 },
        );
        gsap.set(".tm-ph-principle", { x: 0, opacity: 1 });
        gsap.set(".tm-ph-word > span", { yPercent: 0 });
      });

      /* Small or short screens: no pin, but the emblem still engraves as it scrolls in */
      media.add(
        "(prefers-reduced-motion: no-preference) and (max-width: 999px), (prefers-reduced-motion: no-preference) and (max-height: 679px)",
        () => {
          const emblem = root.querySelector<SVGSVGElement>(".tm-ph-emblem");
          if (!emblem) return;
          const paths = emblem.querySelectorAll(".tm-emblem-path");
          const details = emblem.querySelectorAll(".tm-emblem-visor, .tm-emblem-dot, .tm-emblem-wedge");

          gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(details, { opacity: 0 });
          gsap
            .timeline({ scrollTrigger: { trigger: emblem, start: "top 90%", end: "center 40%", scrub: 0.6 } })
            .to(paths, { strokeDashoffset: 0, stagger: 0.04, ease: "power1.inOut" })
            .to(details, { opacity: 1, stagger: 0.08, duration: 0.3 }, ">-0.3");
        },
      );
    }, root);

    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refresh);
      media.revert();
      context.revert();
    };
  }, [motionPaused]);

  /* Custom cursor */
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || motionPaused) return;

    const query = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!query.matches) return;

    const moveX = gsap.quickTo(cursor, "x", { duration: 0.3, ease: "power3.out" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.3, ease: "power3.out" });

    function move(event: PointerEvent) {
      if (!cursor || !query.matches) return;
      moveX(event.clientX);
      moveY(event.clientY);
      cursor.style.opacity = "1";
      const target = event.target as HTMLElement;
      cursor.classList.toggle(
        "tm-cursor-active",
        Boolean(target.closest("a, button, input, select, textarea, summary")),
      );
    }
    function hide() {
      if (cursor) cursor.style.opacity = "0";
    }

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    query.addEventListener("change", hide);

    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
      query.removeEventListener("change", hide);
      moveX.tween.kill();
      moveY.tween.kill();
      hide();
    };
  }, [motionPaused]);

  /* Mobile menu dismissal */
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    function onOutside(event: PointerEvent) {
      if (!(event.target as HTMLElement).closest(".tm-header")) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [menuOpen]);

  /* "More" dropdown dismissal */
  useEffect(() => {
    if (!moreOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMoreOpen(false);
        moreRef.current?.querySelector("button")?.focus();
      }
    }
    function onOutside(event: PointerEvent) {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [moreOpen]);

  function followNav(item: NavItem) {
    if (item.inquiry) setInquiry(item.inquiry);
    setMenuOpen(false);
    setMoreOpen(false);
  }

  return (
    <div ref={rootRef} id="top" className={`tm-site ${motionPaused ? "tm-motion-paused" : ""}`}>
      {showLoader && (
        <LoadingScreen
          onSlideStart={() => setHeroRevealed(true)}
          onComplete={() => {
            setShowLoader(false);
            setHeroRevealed(true);
            setLandingPageArrived(true);
            requestAnimationFrame(() => ScrollTrigger.refresh());
          }}
        />
      )}

      <a href="#main-content" className="tm-skip-link">Skip to content</a>
      <div className="tm-scroll-progress" aria-hidden="true" />
      <div ref={cursorRef} className="tm-cursor" aria-hidden="true" />

      {/* ------------------------------------------------------------------ */}
      <header className="tm-header">
        <div className="tm-container tm-header-inner">
          <Brand />

          <nav className="tm-desktop-nav" aria-label="Primary navigation">
            {NAV_PRIMARY.map((item) => (
              <a href={item.href} key={item.label} onClick={() => followNav(item)}>
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
                More
                <svg viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2.5 4.5 6 8l3.5-3.5" />
                </svg>
              </button>
              <div id="tm-nav-more-panel" className="tm-nav-more-panel">
                {NAV_MORE.map(([label, href]) => (
                  <a href={href} key={href} onClick={() => setMoreOpen(false)}>
                    {label} <Arrow diagonal />
                  </a>
                ))}
              </div>
            </div>
          </nav>

          <div className="tm-header-actions">
            <button
              type="button"
              className="tm-icon-button"
              aria-label="Replay intro animation"
              title="Replay intro"
              onClick={() => {
                setHeroRevealed(false);
                setLandingPageArrived(false);
                setHeroAnimationStarted(false);
                setShowLoader(true);
              }}
            >
              <span aria-hidden="true">↺</span>
            </button>
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
              Connect <Arrow diagonal />
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
          {NAV_PRIMARY.map((item) => (
            <a href={item.href} key={item.label} onClick={() => followNav(item)}>
              {item.label} <Arrow diagonal />
            </a>
          ))}
          <span className="tm-mobile-nav-group tm-mono">More</span>
          {NAV_MORE.map(([label, href]) => (
            <a href={href} key={href} className="is-secondary" onClick={() => setMenuOpen(false)}>
              {label} <Arrow diagonal />
            </a>
          ))}
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        {/* ============================================================== */}
        {/* 01 — THE AWAKENING                                              */}
        {/* ============================================================== */}
        <section className="tm-hero" aria-labelledby="hero-title">
          <HeroImage darkLayerActive={heroAnimationStarted} />
          <div className="tm-hero-facets" aria-hidden="true" />

          <div className="tm-container tm-hero-layout">
            <div className={`tm-hero-top tm-mono ${heroAnimationStarted ? "is-active" : ""}`}>
              <span>SEBI REGISTERED RESEARCH ANALYST · {CONTACT.registration}</span>
            </div>

            <div className="tm-hero-copy">
              <h1 id="hero-title" className="tm-hero-title">
                <span className="tm-hero-split-line">
                  {heroAnimationStarted ? (
                    <SplitText
                      text="The market"
                      tag="span"
                      effect="rise"
                      splitType="chars"
                      delay={35}
                      duration={1.0}
                      staggerFrom="start"
                      trigger="load"
                      hoverEffect="lift"
                      textAlign="left"
                    />
                  ) : (
                    <span className="tm-hero-placeholder">The market</span>
                  )}
                </span>
                <span className="tm-hero-split-line">
                  {heroAnimationStarted ? (
                    <SplitText
                      text="doesn't reward"
                      tag="span"
                      effect="rise"
                      splitType="chars"
                      delay={35}
                      duration={1.0}
                      staggerFrom="start"
                      trigger="load"
                      hoverEffect="lift"
                      textAlign="left"
                    />
                  ) : (
                    <span className="tm-hero-placeholder">doesn't reward</span>
                  )}
                </span>
                <span className="tm-hero-split-line tm-gold-text">
                  {heroAnimationStarted ? (
                    <SplitText
                      text="the impulsive."
                      tag="span"
                      effect="rise"
                      splitType="chars"
                      delay={35}
                      duration={1.0}
                      staggerFrom="start"
                      trigger="load"
                      hoverEffect="lift"
                      textAlign="left"
                      color="#D6B574"
                      accentColor="#F6E9C4"
                    />
                  ) : (
                    <span className="tm-hero-placeholder tm-gold-text">the impulsive.</span>
                  )}
                </span>
              </h1>

              <div className={`tm-hero-support-wrap ${heroAnimationStarted ? "is-active" : ""}`}>
                {heroAnimationStarted ? (
                  <SplitText
                    text="Precision-driven thinking. Disciplined execution. A different perspective on the markets."
                    tag="p"
                    className="tm-hero-support"
                    effect="fade"
                    splitType="words"
                    delay={25}
                    duration={0.8}
                    trigger="load"
                    hoverEffect="none"
                    textAlign="left"
                  />
                ) : (
                  <p className="tm-hero-support tm-hero-placeholder">
                    Precision-driven thinking. Disciplined execution. A different perspective on the markets.
                  </p>
                )}
              </div>

              <div className={`tm-hero-buttons ${heroAnimationStarted ? "is-active" : ""}`}>
                <MagneticLink href="#strategy">Explore our approach</MagneticLink>
                <a className="tm-button tm-button-ghost" href="#contact">
                  <span>Connect with us</span>
                </a>
              </div>
            </div>
          </div>

          <div className={`tm-ticker ${heroAnimationStarted ? "is-active" : ""}`} aria-label="Illustrative market ticker. Not live data.">
            <div className="tm-ticker-label">ILLUSTRATIVE · NOT LIVE</div>
            <div className="tm-ticker-window">
              <div className="tm-ticker-track">
                {[0, 1].map((copy) => (
                  <div className="tm-ticker-group" key={copy} aria-hidden={copy === 1 || undefined}>
                    {TICKER.map((item) => (
                      <div className="tm-ticker-item" key={item.name}>
                        <span>{item.name}</span>
                        <strong>{item.value}</strong>
                        <b className={item.up ? "tm-green" : "tm-red"}>{item.change}</b>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 02 — THE MARKET IS ALIVE                                        */}
        {/* ============================================================== */}
        <section id="market" className="tm-market" aria-labelledby="market-title">
          <div className="tm-market-stage">
            <MarketScene />

            <div className="tm-container tm-market-overlay">
              <div className="tm-market-heading">
                <Eyebrow>02 / THE MARKET IS ALIVE</Eyebrow>
                <h2 id="market-title">
                  Chaos is visible.<br />
                  <span className="tm-gold-text">Opportunity requires clarity.</span>
                </h2>
                <p>
                  Trading Monks is an independent equity research practice led by{" "}
                  <strong>{CONTACT.name}</strong>. We connect price structure, volume
                  participation and business fundamentals into structured research views —
                  each with its risk parameters defined from the start.
                </p>
              </div>

              <div className="tm-m-concepts">
                {CONCEPTS.map((c) => (
                  <article className="tm-m-concept" key={c.index}>
                    <span className="tm-mono tm-gold">{c.index}</span>
                    <h3>{c.name}</h3>
                    <p>{c.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 03 — THE MONK'S PHILOSOPHY (ivory)                              */}
        {/* ============================================================== */}
        <section id="philosophy" className="tm-philosophy" aria-labelledby="ph-title">
          <div className="tm-container">
            <div className="tm-ph-top tm-mono">
              <span>03 / THE MONK'S PHILOSOPHY</span>
              <span>CALM IS A COMPETITIVE ADVANTAGE</span>
            </div>

            <div className="tm-ph-stage">
              {/* Left — the statement */}
              <div className="tm-ph-side">
                <h2 id="ph-title" className="tm-ph-title">
                  <span className="tm-ph-word"><span>Discipline</span></span>
                  <span className="tm-ph-word tm-ph-word-small"><span>over</span></span>
                  <span className="tm-ph-word"><span>Impulse.</span></span>
                </h2>

                <p className="tm-ph-copy tm-reveal">
                  Markets move. Emotions fluctuate. Our philosophy begins with a commitment
                  to process, research and disciplined decision-making.
                </p>
              </div>

              {/* Centre — the emblem draws itself on scroll */}
              <div className="tm-ph-center" aria-hidden="true">
                <Emblem className="tm-ph-emblem" />
              </div>

              {/* Right — the principles */}
              <div className="tm-ph-principles">
                {PRINCIPLES.map((p) => (
                  <article className="tm-ph-principle" key={p.number}>
                    <div className="tm-ph-card-bar" aria-hidden="true" />
                    <div className="tm-ph-card-header">
                      <span className="tm-ph-principle-badge">{p.number}</span>
                      <span className="tm-ph-principle-tag">{p.tag}</span>
                      <div className="tm-ph-icon-box" aria-hidden="true">
                        {p.iconType === "chart" && (
                          <svg viewBox="0 0 24 24" fill="none" className="tm-ph-icon">
                            <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            <path d="M7 14l4-4 4 3 5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {p.iconType === "balance" && (
                          <svg viewBox="0 0 24 24" fill="none" className="tm-ph-icon">
                            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        )}
                        {p.iconType === "shield" && (
                          <svg viewBox="0 0 24 24" fill="none" className="tm-ph-icon">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 04 — INSIDE THE STRATEGY                                        */}
        {/* ============================================================== */}
        <StrategySection activeStage={activeStage} onJump={jumpToStage} />

        {/* ============================================================== */}
        {/* 05 — GOVERNANCE & RESEARCH INTEGRITY                            */}
        {/* ============================================================== */}
        <GovernanceSection />

        {/* ============================================================== */}
        {/* 05.5 — SOCIAL PROOF & TESTIMONIALS                              */}
        {/* ============================================================== */}
        <div id="testimonials" className="tm-testimonials-wrapper">
          <TestimonialsSection
            title="Trusted by Serious Market Participants"
            description="Disciplined investors, prop traders, and allocators rely on Trading Monks for objective structural equity research."
            testimonials={TESTIMONIALS}
          />
        </div>

        {/* ============================================================== */}
        {/* 06 — THE INVITATION                                             */}
        {/* ============================================================== */}
        <section id="contact" className="tm-contact" aria-labelledby="contact-title">
          <div className="tm-contact-glow" aria-hidden="true" />

          <Emblem className="tm-contact-emblem" metallic />

          <div className="tm-container tm-contact-container">
            <div className="tm-contact-card tm-reveal">
              {/* Left Column: Get In Touch */}
              <div className="tm-contact-col-info">
                <div className="tm-contact-heading-group">
                  <Eyebrow>06 / THE INVITATION</Eyebrow>
                  <h2 id="contact-title" className="tm-contact-main-title">
                    Get In touch<br />
                    <span className="tm-gold-text">with us!</span>
                  </h2>
                  <p className="tm-contact-desc">
                    Have questions or ideas? We&apos;d love to hear from you. Reach out anytime
                    and let&apos;s connect.
                  </p>
                </div>

                <div className="tm-contact-left-bottom">
                  <a href={`mailto:${CONTACT.email}`} className="tm-button tm-contact-cta-btn">
                    <span>Contact Us</span>
                    <Arrow diagonal />
                  </a>

                  <div className="tm-contact-direct-list">
                    <div className="tm-contact-direct-item">
                      <span className="tm-direct-label">DIRECT EMAIL</span>
                      <a href={`mailto:${CONTACT.email}`} className="tm-direct-val">{CONTACT.email}</a>
                    </div>
                    <div className="tm-contact-direct-item">
                      <span className="tm-direct-label">PHONE</span>
                      <a href={`tel:+91${CONTACT.phone}`} className="tm-direct-val">+91 {CONTACT.phone}</a>
                    </div>
                    <div className="tm-contact-direct-item">
                      <span className="tm-direct-label">HEADQUARTERS</span>
                      <span className="tm-direct-val">{CONTACT.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Us Form */}
              <div className="tm-contact-col-form">
                <div className="tm-contact-inner-box">
                  <ContactForm inquiry={inquiry} onInquiryChange={setInquiry} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================ */}
      {/* 07 — THE SIGNATURE                                                */}
      {/* ================================================================ */}
      <footer className="tm-footer">
        <div className="tm-footer-line" aria-hidden="true" />

        <div className="tm-container">
          <div className="tm-footer-top">
            <div className="tm-footer-brand">
              <Brand />
              <span className="tm-mono tm-muted">NEW DELHI, INDIA</span>
            </div>

            <nav aria-label="Footer navigation" className="tm-footer-nav">
              <div>
                <span className="tm-mono tm-muted">SITE</span>
                <a href="#philosophy">About</a>
                <a href="#strategy">Our approach</a>
                <a href="#edge">Credentials & disclosures</a>
                <a href="#testimonials">Testimonials</a>
                <a href="#contact">Contact</a>
              </div>
              <div>
                <span className="tm-mono tm-muted">CONNECT</span>
                {/* Replace with the firm's official LinkedIn URL before launch */}
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                  LinkedIn <Arrow diagonal />
                </a>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                <a href={`tel:+91${CONTACT.phone}`}>+91 {CONTACT.phone}</a>
              </div>
              <div>
                <span className="tm-mono tm-muted">LEGAL</span>
                <a href="/privacy">Privacy policy</a>
                <a href="/terms">Terms & conditions</a>
                <a href="#edge">Regulatory & risk disclosures</a>
              </div>
            </nav>
          </div>

          <div className="tm-footer-statement">
            <Emblem className="tm-footer-emblem" metallic />
            <strong>TRADING MONKS</strong>
            <p>Discipline in process. Clarity in decision-making.</p>
          </div>

          <div className="tm-footer-bottom">
            <p>© <CurrentYear /> Trading Monks. All rights reserved.</p>
            <p>
              {CONTACT.name} · SEBI Research Analyst Reg. {CONTACT.registration} · Valid{" "}
              {CONTACT.validity}
            </p>
          </div>

          <p className="tm-footer-risk">
            Investments in securities market are subject to market risks. Read all the
            related documents carefully before investing. Registration granted by SEBI and
            certification from NISM in no way guarantee performance of the research analyst
            or provide any assurance of returns to investors.
          </p>
        </div>
      </footer>
    </div>
  );
}
