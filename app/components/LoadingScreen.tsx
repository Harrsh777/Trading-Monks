"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./LoadingScreen.css";

interface LoadingScreenProps {
  onSlideStart?: () => void;
  onComplete?: () => void;
}

export default function LoadingScreen({
  onSlideStart,
  onComplete,
}: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [isExited, setIsExited] = useState(false);
  const hasSkipped = useRef(false);
  const onSlideStartRef = useRef(onSlideStart);
  const onCompleteRef = useRef(onComplete);

  // Keep callback refs updated without re-triggering effects
  useEffect(() => {
    onSlideStartRef.current = onSlideStart;
    onCompleteRef.current = onComplete;
  });

  const titleText = "TRADING MONKS";

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setIsExited(true);
      onSlideStartRef.current?.();
      onCompleteRef.current?.();
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Single master timeline for the entire sequence
    const masterTl = gsap.timeline();

    // 1. Initial positions
    gsap.set(container, { xPercent: 0, opacity: 1 });
    gsap.set(".tm-minimal-letter", { yPercent: 120, opacity: 0 });

    // 2. Slow, graceful reveal of "TRADING MONKS"
    masterTl.to(".tm-minimal-letter", {
      yPercent: 0,
      opacity: 1,
      duration: 1.8,
      stagger: 0.07,
      ease: "power3.out",
      delay: 0.5,
    })
    // 3. Pause so the user can clearly see and read the brand
    .to({}, { duration: 0.7 })
    // 4. Trigger landing page hero text reveal as the curtain begins to open
    .call(() => {
      onSlideStartRef.current?.();
    })
    // 5. Pitch black screen slides smoothly to the right, uncovering the hero section
    .to(container, {
      xPercent: 100,
      duration: 1.4,
      ease: "power4.inOut",
    })
    // 6. Complete and clean up
    .call(() => {
      setIsExited(true);
      onCompleteRef.current?.();
    });

    // Allow user to click or press any key to immediately slide to the right
    const handleSkip = () => {
      if (hasSkipped.current || !container) return;
      hasSkipped.current = true;

      masterTl.kill();
      onSlideStartRef.current?.();

      gsap.to(container, {
        xPercent: 100,
        duration: 1.0,
        ease: "power4.inOut",
        onComplete: () => {
          setIsExited(true);
          onCompleteRef.current?.();
        },
      });
    };

    container.addEventListener("click", handleSkip);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("click", handleSkip);
      window.removeEventListener("keydown", handleKeyDown);
      masterTl.kill();
    };
  }, []); // Run once on mount

  if (isExited) return null;

  return (
    <aside
      ref={containerRef}
      className="tm-minimal-loader"
      aria-label="Trading Monks Intro Screen"
      role="dialog"
      aria-modal="true"
    >
      <div className="tm-minimal-center">
        <h1 ref={textRef} className="tm-minimal-title">
          {titleText.split("").map((char, index) => (
            <span key={index} className="tm-minimal-char-wrap">
              <span className="tm-minimal-letter">
                {char === " " ? "\u00A0" : char}
              </span>
            </span>
          ))}
        </h1>
      </div>
    </aside>
  );
}
