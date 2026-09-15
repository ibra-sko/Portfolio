"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

interface TextSplitProps {
  children: string;
  className?: string;
  topClassName?: string;
  bottomClassName?: string;
  maxMove?: number;
  falloff?: number;
  ariaHidden?: boolean;
}

const joinClasses = (...classes: Array<string | undefined>) => classes.filter(Boolean).join(" ");

export function TextSplit({
  children,
  className,
  topClassName,
  bottomClassName,
  maxMove = 48,
  falloff = 0.45,
  ariaHidden = false,
}: TextSplitProps) {
  const [offsets, setOffsets] = useState<ReadonlyMap<number, number>>(new Map());
  const characterRefs = useRef(new Map<number, HTMLSpanElement>());
  const reduce = useReducedMotion();
  let characterIndex = 0;

  const updateOffsets = (target: HTMLSpanElement, pointerX: number) => {
    if (reduce) return;

    const hoveredRect = target.getBoundingClientRect();
    const hoveredLineCenter = hoveredRect.top + hoveredRect.height / 2;
    const radius = hoveredRect.height * (0.55 / Math.max(falloff, 0.12));
    const nextOffsets = new Map<number, number>();

    characterRefs.current.forEach((character, index) => {
      const rect = character.getBoundingClientRect();
      const lineCenter = rect.top + rect.height / 2;
      const lineTolerance = Math.min(rect.height, hoveredRect.height) * 0.28;

      if (Math.abs(lineCenter - hoveredLineCenter) > lineTolerance) return;

      const distance = Math.abs(rect.left + rect.width / 2 - pointerX);
      const influence = Math.max(0, 1 - distance / radius);

      if (influence > 0) nextOffsets.set(index, maxMove * Math.pow(influence, 1.45));
    });

    setOffsets(nextOffsets);
  };

  return (
    <span
      className={joinClasses("split-text", className)}
      aria-hidden={ariaHidden || undefined}
      aria-label={ariaHidden ? undefined : children}
      onMouseLeave={() => setOffsets(new Map())}
    >
      {children.split(/(\s+)/).map((token, tokenIndex) => {
        if (/^\s+$/.test(token)) {
          characterIndex += token.length;
          return <span className="split-space" key={`space-${tokenIndex}`}>{token}</span>;
        }

        return (
          <span className="split-word" key={`${token}-${tokenIndex}`} aria-hidden="true">
            {Array.from(token).map((character) => {
              const index = characterIndex++;
              const offset = reduce ? 0 : offsets.get(index) ?? 0;

              return (
                <span
                  className="split-character"
                  key={`${character}-${index}`}
                  ref={(node) => {
                    if (node) characterRefs.current.set(index, node);
                    else characterRefs.current.delete(index);
                  }}
                  onMouseEnter={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    updateOffsets(event.currentTarget, rect.left + rect.width / 2);
                  }}
                  onMouseMove={(event) => {
                    updateOffsets(event.currentTarget, event.clientX);
                  }}
                >
                  <span className="split-measure">{character}</span>
                  <motion.span
                    className={joinClasses("split-half split-half-top", topClassName)}
                    initial={false}
                    animate={{ y: `-${offset}%` }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="split-glyph split-glyph-top">{character}</span>
                  </motion.span>
                  <motion.span
                    className={joinClasses("split-half split-half-bottom", bottomClassName)}
                    initial={false}
                    animate={{ y: `${offset}%` }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="split-glyph split-glyph-bottom">{character}</span>
                  </motion.span>
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
