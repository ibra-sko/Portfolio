"use client";

import { useEffect, useRef, useState } from "react";
import { TextSplit } from "./split-text";

const SCRAMBLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&";

function scramble(text: string, progress: number, frame: number) {
  const characters = Array.from(text);
  const total = characters.filter((character) => !/\s/.test(character)).length;
  const resolved = Math.floor(total * progress);
  let position = 0;

  return characters.map((character, index) => {
    if (/\s/.test(character)) return character;
    const current = position++;
    if (current < resolved || progress >= 1) return character;
    return SCRAMBLE_CHARACTERS[(index * 13 + frame * 7) % SCRAMBLE_CHARACTERS.length];
  }).join("");
}

interface TextScrambleProps {
  text: string;
  delay?: number;
  className?: string;
  reduce?: boolean | null;
  inView?: boolean;
  speed?: number;
}

export function TextScramble({
  text,
  delay = 0,
  className = "",
  reduce = false,
  inView = false,
  speed = 0.055,
}: TextScrambleProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [displayText, setDisplayText] = useState(text);
  const [revealed, setRevealed] = useState(Boolean(reduce));

  useEffect(() => {
    if (reduce) {
      setDisplayText(text);
      setRevealed(true);
      return;
    }

    const element = rootRef.current;
    if (!element) return;
    let animationFrame = 0;
    let timeout = 0;
    let started = false;
    const duration = Math.max(700, text.replace(/\s/g, "").length * speed * 1000 + 350);

    const start = () => {
      if (started) return;
      started = true;
      timeout = window.setTimeout(() => {
        const startTime = performance.now();
        let lastFrame = -1;
        setDisplayText(scramble(text, 0, 0));
        setRevealed(true);

        const update = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const frame = Math.floor((now - startTime) / 45);
          if (frame !== lastFrame) {
            setDisplayText(scramble(text, progress, frame));
            lastFrame = frame;
          }
          if (progress < 1) animationFrame = requestAnimationFrame(update);
          else setDisplayText(text);
        };

        animationFrame = requestAnimationFrame(update);
      }, delay * 1000);
    };

    if (!inView) {
      start();
      return () => {
        window.clearTimeout(timeout);
        cancelAnimationFrame(animationFrame);
      };
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      start();
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(element);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [delay, inView, reduce, speed, text]);

  return (
    <span ref={rootRef} className={joinClasses("text-scramble", className)}>
      <span className="visually-hidden">{text}</span>
      <span className="text-scramble-visual" data-revealed={revealed || undefined} aria-hidden="true">
        <TextSplit ariaHidden>{displayText}</TextSplit>
      </span>
    </span>
  );
}

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}
