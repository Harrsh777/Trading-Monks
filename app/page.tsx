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

const NAV = [
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
/* 04 — Interactive strategy system                                           */
/* -------------------------------------------------------------------------- */

function StageVisual({ stageIndex }: { stageIndex: number }) {
  if (stageIndex === 0) {
    return (
      <div className="tm-s-vis tm-s-vis-observe">
        <div className="tm-s-vis-header">
          <span className="tm-mono">PRICE ACTION / STRUCTURAL MAPPING</span>
          <span className="tm-mono tm-gold">ACTIVE</span>
        </div>
        <svg viewBox="0 0 460 210" className="tm-s-svg" fill="none">
          <line x1="30" y1="40" x2="430" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="30" y1="90" x2="430" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="30" y1="140" x2="430" y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
          <line x1="30" y1="52" x2="430" y2="52" stroke="#ff626f" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.85" />
          <text x="35" y="47" fill="#ff626f" fontSize="10" fontFamily="monospace" letterSpacing="0.08em">RESISTANCE CORRIDOR (22,850)</text>
          <line x1="30" y1="165" x2="430" y2="165" stroke="#bcff5e" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.85" />
          <text x="35" y="180" fill="#bcff5e" fontSize="10" fontFamily="monospace" letterSpacing="0.08em">SUPPORT CONSOLIDATION (22,150)</text>
          {[
            { x: 65, o: 155, c: 130, h: 120, l: 160, up: true },
            { x: 102, o: 130, c: 140, h: 125, l: 148, up: false },
            { x: 139, o: 140, c: 110, h: 102, l: 145, up: true },
            { x: 176, o: 110, c: 80, h: 72, l: 115, up: true },
            { x: 213, o: 80, c: 60, h: 54, l: 85, up: true },
            { x: 250, o: 60, c: 75, h: 56, l: 82, up: false },
            { x: 287, o: 75, c: 92, h: 70, l: 100, up: false },
            { x: 324, o: 92, c: 120, h: 88, l: 126, up: false },
            { x: 361, o: 120, c: 155, h: 115, l: 160, up: false },
            { x: 398, o: 155, c: 128, h: 120, l: 162, up: true },
          ].map((c, i) => (
            <g key={i} className="tm-s-candle-anim">
              <line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke={c.up ? "#bcff5e" : "#ff626f"} strokeWidth="1.4" />
              <rect
                x={c.x - 6}
                y={Math.min(c.o, c.c)}
                width="12"
                height={Math.max(Math.abs(c.c - c.o), 4)}
                fill={c.up ? "#bcff5e" : "#ff626f"}
                rx="1"
              />
            </g>
          ))}
        </svg>
        <div className="tm-s-vis-footer">
          <span className="tm-mono">NOISE REDUCTION: 94%</span>
          <span className="tm-mono tm-gold">STRUCTURE: CLEAR</span>
        </div>
      </div>
    );
  }

  if (stageIndex === 1) {
    return (
      <div className="tm-s-vis tm-s-vis-validate">
        <div className="tm-s-vis-header">
          <span className="tm-mono">VOLUME PARTICIPATION & MOMENTUM</span>
          <span className="tm-mono tm-gold">CONFIRMED</span>
        </div>
        <svg viewBox="0 0 460 210" className="tm-s-svg" fill="none">
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d6b574" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#d6b574" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 40 155 Q 140 145 200 105 T 360 45 L 420 35 L 420 175 L 40 175 Z"
            fill="url(#trendGrad)"
          />
          <path
            d="M 40 155 Q 140 145 200 105 T 360 45 L 420 35"
            stroke="#d6b574"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {[28, 44, 35, 62, 85, 95, 78, 110, 135, 142].map((h, i) => (
            <rect
              key={i}
              x={48 + i * 37}
              y={175 - h * 0.45}
              width="20"
              height={h * 0.45}
              fill={i >= 6 ? "#d6b574" : "rgba(214, 181, 116, 0.35)"}
              rx="2"
            />
          ))}
          <line x1="30" y1="175" x2="430" y2="175" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <text x="320" y="28" fill="#d6b574" fontSize="10" fontFamily="monospace">ACCUMULATION FLOW</text>
        </svg>
        <div className="tm-s-vis-footer">
          <span className="tm-mono">INSTITUTIONAL FLOW: +24.8%</span>
          <span className="tm-mono tm-gold">CONVICTION: HIGH</span>
        </div>
      </div>
    );
  }

  if (stageIndex === 2) {
    return (
      <div className="tm-s-vis tm-s-vis-structure">
        <div className="tm-s-vis-header">
          <span className="tm-mono">ASYMMETRIC PARAMETER MATRIX</span>
          <span className="tm-mono tm-gold">RATIO 3.4 : 1</span>
        </div>
        <svg viewBox="0 0 460 210" className="tm-s-svg" fill="none">
          <rect x="40" y="30" width="380" height="42" fill="rgba(188, 255, 94, 0.12)" rx="4" stroke="rgba(188, 255, 94, 0.45)" />
          <text x="55" y="56" fill="#bcff5e" fontSize="11" fontFamily="monospace" fontWeight="bold">TARGET CORRIDOR (+8.50%)</text>
          
          <rect x="40" y="95" width="380" height="32" fill="rgba(214, 181, 116, 0.15)" rx="4" stroke="rgba(214, 181, 116, 0.65)" />
          <text x="55" y="116" fill="#d6b574" fontSize="11" fontFamily="monospace" fontWeight="bold">ENTRY CORRIDOR (22,340 — 22,390)</text>

          <rect x="40" y="150" width="380" height="32" fill="rgba(255, 98, 111, 0.12)" rx="4" stroke="rgba(255, 98, 111, 0.45)" strokeDasharray="4 2" />
          <text x="55" y="171" fill="#ff626f" fontSize="11" fontFamily="monospace" fontWeight="bold">INVALIDATION BOUNDARY (-2.10%)</text>
        </svg>
        <div className="tm-s-vis-footer">
          <span className="tm-mono">MAX UPSIDE ASYMMETRY</span>
          <span className="tm-mono tm-gold">STRICT BOUNDARY</span>
        </div>
      </div>
    );
  }

  if (stageIndex === 3) {
    return (
      <div className="tm-s-vis tm-s-vis-risk">
        <div className="tm-s-vis-header">
          <span className="tm-mono">DOWNSIDE EXPOSURE & EVENT RADAR</span>
          <span className="tm-mono tm-gold">BOUNDARIES SET</span>
        </div>
        <svg viewBox="0 0 460 210" className="tm-s-svg" fill="none">
          <circle cx="230" cy="110" r="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx="230" cy="110" r="55" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <circle cx="230" cy="110" r="32" stroke="rgba(214,181,116,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="150" y1="110" x2="310" y2="110" stroke="rgba(255,255,255,0.12)" />
          <line x1="230" y1="30" x2="230" y2="190" stroke="rgba(255,255,255,0.12)" />
          <circle cx="190" cy="78" r="4" fill="#d6b574" />
          <text x="135" y="74" fill="#d6b574" fontSize="9" fontFamily="monospace">VOLATILITY CAP</text>
          <circle cx="280" cy="88" r="4" fill="#bcff5e" />
          <text x="288" y="91" fill="#bcff5e" fontSize="9" fontFamily="monospace">LIQUIDITY SAFE</text>
          <circle cx="210" cy="155" r="4" fill="#ff626f" />
          <text x="135" y="160" fill="#ff626f" fontSize="9" fontFamily="monospace">EVENT RISK</text>
          <circle cx="230" cy="110" r="6" fill="#d6b574" />
        </svg>
        <div className="tm-s-vis-footer">
          <span className="tm-mono">PORTFOLIO DRAWDOWN: &lt; 1.8%</span>
          <span className="tm-mono tm-gold">RISK ISOLATED</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tm-s-vis tm-s-vis-review">
      <div className="tm-s-vis-header">
        <span className="tm-mono">CONTINUOUS REASSESSMENT AUDIT</span>
        <span className="tm-mono tm-gold">ACTIVE MONITORING</span>
      </div>
      <svg viewBox="0 0 460 210" className="tm-s-svg" fill="none">
        <ellipse cx="230" cy="110" rx="135" ry="50" stroke="rgba(214,181,116,0.35)" strokeWidth="1.5" strokeDasharray="6 4" />
        <ellipse cx="230" cy="110" rx="95" ry="34" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="95" cy="110" r="5" fill="#d6b574" />
        <text x="50" y="132" fill="#d6b574" fontSize="10" fontFamily="monospace">01 / VALIDATE</text>
        <circle cx="230" cy="60" r="5" fill="#bcff5e" />
        <text x="195" y="46" fill="#bcff5e" fontSize="10" fontFamily="monospace">02 / MONITOR</text>
        <circle cx="365" cy="110" r="5" fill="#d6b574" />
        <text x="340" y="132" fill="#d6b574" fontSize="10" fontFamily="monospace">03 / ADJUST</text>
        <circle cx="230" cy="160" r="5" fill="#bcff5e" />
        <text x="195" y="182" fill="#bcff5e" fontSize="10" fontFamily="monospace">04 / DISCLOSE</text>
      </svg>
      <div className="tm-s-vis-footer">
        <span className="tm-mono">AUDIT FREQUENCY: HOURLY</span>
        <span className="tm-mono tm-gold">PERSPECTIVE: DYNAMIC</span>
      </div>
    </div>
  );
}

function StrategyDiagram({
  active,
  focused,
  onFocus,
}: {
  active: number;
  focused: number | null;
  onFocus: (index: number | null) => void;
}) {
  const currentIndex = focused ?? active;
  const shown = STAGES[currentIndex];

  return (
    <div className="tm-s-system">
      <div className="tm-s-diagram" onPointerLeave={() => onFocus(null)}>
        <svg className="tm-s-rail" viewBox="0 0 1000 8" preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" x2="1000" y1="4" y2="4" className="tm-s-rail-base" />
          <line x1="0" x2="1000" y1="4" y2="4" className="tm-s-line" pathLength="1" />
        </svg>

        <div className="tm-s-nodes" role="tablist" aria-label="Research stages">
          {STAGES.map((stage, i) => {
            const isActive = i <= active;
            const isCurrent = currentIndex === i;
            return (
              <button
                type="button"
                key={stage.number}
                role="tab"
                aria-selected={isCurrent}
                className={`tm-s-node ${isActive ? "is-active" : ""} ${isCurrent ? "is-current" : ""}`}
                onPointerEnter={() => onFocus(i)}
                onFocus={() => onFocus(i)}
                onClick={() => onFocus(i)}
              >
                <span className="tm-s-dot" aria-hidden="true">
                  <i />
                </span>
                <span className="tm-s-number">{stage.number}</span>
                <span className="tm-s-name">{stage.name}</span>
                <span className="tm-s-label">{stage.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="tm-s-cockpit" aria-live="polite">
        <div className="tm-s-cockpit-grid">
          {/* Visual Telemetry Column */}
          <div className="tm-s-cockpit-vis">
            <StageVisual stageIndex={currentIndex} />
          </div>

          {/* Descriptive Intel Column */}
          <div className="tm-s-cockpit-info">
            <div className="tm-s-detail-number" aria-hidden="true">{shown.number}</div>
            
            <div className="tm-s-badge-row">
              <span className="tm-stage-badge tm-stage-badge-gold">
                <i /> {shown.name.toUpperCase()}
              </span>
              <span className="tm-stage-badge">
                {shown.pill}
              </span>
            </div>

            <span className="tm-mono tm-s-meta-label">{shown.label}</span>
            <h3 className="tm-s-title">{shown.title}</h3>
            <p className="tm-s-desc">{shown.text}</p>

            <div className="tm-s-telemetry-tag">
              <span className="tm-mono">SYSTEM STATUS</span>
              <span className="tm-mono tm-gold">{shown.signal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 06 — Contact form                                                          */
/* -------------------------------------------------------------------------- */

type FormStatus = "idle" | "sending" | "sent" | "fallback";

function ContactForm() {
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
          className="tm-contact-submit-btn"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className={`tm-card-form ${status === "sending" ? "is-sending" : ""}`} onSubmit={onSubmit}>
      <h3 className="tm-form-header-title">Contact Us</h3>

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
            defaultValue={INQUIRY_TYPES[0]}
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
          className="tm-contact-submit-btn"
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
  const [motionPaused, setMotionPaused] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [heroRevealed, setHeroRevealed] = useState(false);
  const [landingPageArrived, setLandingPageArrived] = useState(false);
  const [heroAnimationStarted, setHeroAnimationStarted] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [focusedStage, setFocusedStage] = useState<number | null>(null);

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

        gsap.to(".tm-edge-emblem", {
          yPercent: -14,
          rotate: 5,
          ease: "none",
          scrollTrigger: { trigger: ".tm-edge", start: "top bottom", end: "bottom top", scrub: 1 },
        });

        gsap.from(".tm-capability-card", {
          x: 20,
          opacity: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tm-capabilities-list", start: "top 85%", once: true },
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
            gsap.set(phCards, { y: 35, opacity: 0 });

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

            // 2. Logo geometric facets draw progressively across the scroll
            phTl.to(
              phPaths,
              {
                strokeDashoffset: 0,
                stagger: 0.045,
                duration: 2.2,
                ease: "power1.inOut",
              },
              0.15,
            );

            // 3. Principle cards slide and illuminate in sync with drawing
            phTl.to(
              phCards,
              { y: 0, opacity: 1, stagger: 0.18, duration: 0.85, ease: "power2.out" },
              0.9,
            );

            // 4. Logo visor, dots and shoulder wedge emerge as lines complete
            phTl.to(
              phDetails,
              { opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" },
              1.8,
            );

            // 5. Hold so user enjoys the completed logo before unpinning
            phTl.to({}, { duration: 0.4 });
          }

          /* 04 — gold line travels through the system */
          const strategyStage = root.querySelector<HTMLElement>(".tm-strategy-stage");
          if (strategyStage) {
            gsap.set(".tm-s-line", { strokeDashoffset: 1 });
            gsap.timeline({
              scrollTrigger: {
                trigger: strategyStage,
                start: "top 80px",
                end: "+=2200",
                pin: true,
                scrub: 0.8,
                anticipatePin: 1,
                onUpdate(self) {
                  setActiveStage(Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length)));
                },
              },
            })
              .to(".tm-s-line", { strokeDashoffset: 0, duration: 1, ease: "none" })
              .to({}, { duration: 0.2 });

            return () => setActiveStage(STAGES.length - 1);
          }
        },
      );

      /* Without the pinned sequence, treat every stage as reached */
      media.add("(max-width: 999px), (max-height: 679px), (prefers-reduced-motion: reduce)", () => {
        setActiveStage(STAGES.length - 1);
        gsap.set(".tm-s-line", { strokeDashoffset: 0 });
        gsap.set(".tm-ph-emblem .tm-emblem-path", { strokeDashoffset: 0 });
        gsap.set(
          ".tm-ph-emblem .tm-emblem-visor, .tm-ph-emblem .tm-emblem-dot, .tm-ph-emblem .tm-emblem-wedge",
          { opacity: 1 },
        );
        gsap.set(".tm-ph-principle", { y: 0, opacity: 1 });
        gsap.set(".tm-ph-word > span", { yPercent: 0 });
      });
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
            {NAV.map(([label, href]) => (
              <a href={href} key={href}>{label}</a>
            ))}
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
          {NAV.map(([label, href]) => (
            <a href={href} key={href} onClick={() => setMenuOpen(false)}>
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
          <Emblem className="tm-ph-emblem" />

          <div className="tm-container">
            <div className="tm-ph-top tm-mono">
              <span>03 / THE MONK'S PHILOSOPHY</span>
              <span>CALM IS A COMPETITIVE ADVANTAGE</span>
            </div>

            <h2 id="ph-title" className="tm-ph-title">
              <span className="tm-ph-word"><span>Discipline</span></span>
              <span className="tm-ph-word tm-ph-word-small"><span>over</span></span>
              <span className="tm-ph-word"><span>Impulse.</span></span>
            </h2>

            <p className="tm-ph-copy tm-reveal">
              Markets move. Emotions fluctuate. Our philosophy begins with a commitment
              to process, research and disciplined decision-making.
            </p>

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
        </section>

        {/* ============================================================== */}
        {/* 04 — INSIDE THE STRATEGY                                        */}
        {/* ============================================================== */}
        <section id="strategy" className="tm-strategy" aria-labelledby="strategy-title">
          <div className="tm-container tm-strategy-stage">
            <div className="tm-section-heading">
              <div>
                <Eyebrow>04 / INSIDE THE STRATEGY</Eyebrow>
                <h2 id="strategy-title">
                  One system.<br />
                  <span className="tm-gold-text">Five deliberate stages.</span>
                </h2>
              </div>

              <p>
                Research is not a feeling. It is a sequence — each stage with its own
                inputs, checks and stated limits. Scroll, hover or tab through the system.
              </p>
            </div>

            <StrategyDiagram
              active={activeStage}
              focused={focusedStage}
              onFocus={setFocusedStage}
            />

            <p className="tm-fine-print">
              Trading Monks provides independent equity research under SEBI Research
              Analyst registration. It does not execute trades or manage client capital.
            </p>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 05 — THE EDGE                                                   */}
        {/* ============================================================== */}
        {/* ============================================================== */}
        {/* 05 — THE EDGE & GOVERNANCE                                      */}
        {/* ============================================================== */}
        <section id="edge" className="tm-edge" aria-labelledby="edge-title">
          <Emblem className="tm-edge-emblem" />

          <div className="tm-container tm-edge-container">
            {/* Header Statement */}
            <div className="tm-edge-header">
              <div className="tm-edge-header-top">
                <Eyebrow>05 / GOVERNANCE & RESEARCH INTEGRITY</Eyebrow>
                <div className="tm-edge-badge">
                  <span className="tm-pulse-dot" />
                  <span>SEBI REGISTERED · {CONTACT.registration}</span>
                </div>
              </div>

              <div className="tm-edge-header-grid">
                <h2 id="edge-title" className="tm-reveal">
                  Trust isn't a visual effect.<br />
                  <span className="tm-gold-text">It's earned.</span>
                </h2>
                <div className="tm-edge-intro-copy tm-reveal">
                  <p className="tm-body-copy">
                    We don't publish a decorative performance curve, because a retrospective
                    chart is a promise no analyst can make. What we can show is who is
                    behind the research, how it is regulated, and how every view is structured.
                  </p>
                  <a
                    className="tm-edge-verify-btn"
                    href="https://www.sebi.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Verify on SEBI Official Portal</span>
                    <Arrow diagonal />
                  </a>
                </div>
              </div>
            </div>

            {/* 3 Metric Monoliths */}
            <div className="tm-edge-stats tm-reveal">
              <div className="tm-edge-stat">
                <div className="tm-edge-stat-header">
                  <strong>
                    <span className="tm-count" data-value="10">10</span>+
                  </strong>
                  <span className="tm-edge-stat-pill">EXPERIENCE</span>
                </div>
                <h4>Years of Market Analysis</h4>
                <p>Studying market behaviour, price dynamics, institutional volume, and structural cycles.</p>
              </div>

              <div className="tm-edge-stat">
                <div className="tm-edge-stat-header">
                  <strong>
                    <span className="tm-count" data-value="3">3</span>
                  </strong>
                  <span className="tm-edge-stat-pill">METHODOLOGY</span>
                </div>
                <h4>Integrated Research Lenses</h4>
                <p>Synthesizing technical structure, business fundamentals, and explicit risk boundaries.</p>
              </div>

              <div className="tm-edge-stat">
                <div className="tm-edge-stat-header">
                  <strong>
                    <span className="tm-count" data-value="5">5</span>
                  </strong>
                  <span className="tm-edge-stat-pill">REGULATORY</span>
                </div>
                <h4>Year Registration Validity</h4>
                <p>Registered validity period granted by SEBI through February 15, 2031 under RA Regulations.</p>
              </div>
            </div>

            {/* 2-Column Institutional Showcase */}
            <div className="tm-edge-showcase">
              {/* Left Column: Official Certificate Dossier */}
              <div className="tm-edge-dossier tm-reveal">
                <div className="tm-dossier-card">
                  <div className="tm-dossier-header">
                    <div className="tm-dossier-stamp">
                      <span className="tm-stamp-icon">✓</span>
                      <div>
                        <span className="tm-mono tm-gold">OFFICIAL REGISTRATION DOSSIER</span>
                        <h4>SEBI Registered Research Analyst</h4>
                      </div>
                    </div>
                    <span className="tm-mono tm-dossier-status">ACTIVE · INDIVIDUAL</span>
                  </div>

                  <div className="tm-dossier-divider" />

                  <dl className="tm-dossier-grid">
                    <div className="tm-dossier-item">
                      <dt className="tm-mono">REGISTERED NAME</dt>
                      <dd>{CONTACT.name}</dd>
                    </div>
                    <div className="tm-dossier-item">
                      <dt className="tm-mono">REGISTRATION CATEGORY</dt>
                      <dd>Individual Research Analyst</dd>
                    </div>
                    <div className="tm-dossier-item">
                      <dt className="tm-mono">REGISTRATION NUMBER</dt>
                      <dd className="tm-gold">{CONTACT.registration}</dd>
                    </div>
                    <div className="tm-dossier-item">
                      <dt className="tm-mono">VALIDITY PERIOD</dt>
                      <dd>{CONTACT.validity}</dd>
                    </div>
                    <div className="tm-dossier-item tm-dossier-item-full">
                      <dt className="tm-mono">REGISTERED ADDRESS</dt>
                      <dd>{CONTACT.address}</dd>
                    </div>
                  </dl>

                  <div className="tm-dossier-footer">
                    <div className="tm-dossier-sebi">
                      <span className="tm-mono">SEBI HEAD OFFICE</span>
                      <p>SEBI Bhavan, Plot No. C4-A, 'G' Block, BKC, Bandra (E), Mumbai – 400 051</p>
                    </div>
                    <a
                      className="tm-button tm-button-ghost tm-dossier-action"
                      href="https://www.sebi.gov.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Verify Credential</span>
                      <Arrow diagonal />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Capabilities & Disclosures */}
              <div className="tm-edge-insights tm-reveal">
                {/* 3 Capabilities */}
                <div className="tm-capabilities-group">
                  <div className="tm-edge-block-title">
                    <span className="tm-mono tm-gold">CAPABILITIES</span>
                    <h3>Three-Tier Research Framework</h3>
                  </div>

                  <div className="tm-capabilities-list">
                    <div className="tm-capability-card">
                      <span className="tm-capability-number">01</span>
                      <div>
                        <h4>Technical Structure</h4>
                        <p>Support, resistance, consolidation, trend strength, breakout geometry, momentum, and volume delta.</p>
                      </div>
                    </div>

                    <div className="tm-capability-card">
                      <span className="tm-capability-number">02</span>
                      <div>
                        <h4>Business Fundamentals</h4>
                        <p>Earnings trajectory, revenue quality, balance-sheet strength, governance, and competitive position.</p>
                      </div>
                    </div>

                    <div className="tm-capability-card">
                      <span className="tm-capability-number">03</span>
                      <div>
                        <h4>Risk Controls</h4>
                        <p>Downside exposure, invalidation levels, volatility parameters, liquidity, and event risk stated upfront.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disclosures Drawer */}
                <div className="tm-disclosures-card">
                  <div className="tm-edge-block-title">
                    <span className="tm-mono tm-gold">STATUTORY</span>
                    <h3>Regulatory & Risk Disclosures</h3>
                  </div>

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
          </div>
        </section>

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
          {/* Animated Glowing Aurora Backdrop */}
          <div className="tm-contact-aurora-bg" aria-hidden="true">
            <div className="tm-aurora-orb tm-aurora-cyan" />
            <div className="tm-aurora-orb tm-aurora-magenta" />
            <div className="tm-aurora-orb tm-aurora-gold" />
          </div>

          <Emblem className="tm-contact-emblem" metallic />

          <div className="tm-container tm-contact-container">
            <div className="tm-contact-card tm-reveal">
              {/* Left Column: Get In Touch */}
              <div className="tm-contact-col-info">
                <div className="tm-contact-pill">
                  <span className="tm-contact-pill-light" />
                  <span>Contact</span>
                </div>

                <div className="tm-contact-heading-group">
                  <h2 id="contact-title" className="tm-contact-main-title">
                    Get In touch<br />
                    <span>with us!</span>
                  </h2>
                  <p className="tm-contact-desc">
                    Have questions or ideas? We&apos;d love to hear from you. Reach out anytime
                    and let&apos;s connect.
                  </p>
                </div>

                <div className="tm-contact-left-bottom">
                  <a href={`mailto:${CONTACT.email}`} className="tm-contact-cta-btn">
                    <span>Contact Us</span>
                    <Arrow />
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
                  <ContactForm />
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
