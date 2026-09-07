"use client";

/*
 * Iconiq UI — componente de Edwin Vakayil, redistribuído pelo Supernova.
 *
 * Origem:  https://github.com/edwinvakayil/iconiq
 * Revisão: a85ae7b80c97e62da0b7b728a5f8582564289d20
 * Site:    https://iconiqui.com
 *
 * MIT License
 *
 * Copyright (c) 2024-2026 Edwin Vakayil
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import {
  AnimatePresence,
  motion,
  useInView,
  usePageInView,
  useReducedMotion,
} from "motion/react";
import type { ReactNode } from "react";
import { Children, memo, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const CYCLE_INTERVAL = 1600;
const STAGGER_DELAY = 0.125;
const EASE = [0.25, 0.46, 0.45, 0.94] as const;

export type LogosCarouselProps = {
  children: ReactNode;
  columnCount?: number;
  direction?: "ltr" | "rtl";
  className?: string;
};

export function LogosCarousel({
  children,
  columnCount = 4,
  direction = "ltr",
  className,
}: LogosCarouselProps) {
  const logos = useMemo(() => Children.toArray(children), [children]);
  const columns = useMemo(
    () => distribute(logos, columnCount),
    [logos, columnCount]
  );

  const reduceMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "100px" });
  const isPageInView = usePageInView();
  const shouldPlay = !reduceMotion && isInView && isPageInView;

  const [indices, setIndices] = useState(() => columns.map(() => 0));

  const columnsRef = useRef(columns);
  columnsRef.current = columns;

  useEffect(() => {
    if (!shouldPlay) return;
    const id = setInterval(() => {
      setIndices((prev) =>
        columnsRef.current.map((col, i) => ((prev[i] ?? 0) + 1) % col.length)
      );
    }, CYCLE_INTERVAL);
    return () => clearInterval(id);
  }, [shouldPlay]);

  return (
    <div
      className={cn("grid", className)}
      data-slot="logos-carousel"
      ref={containerRef}
      style={{
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
      }}
    >
      {columns.map((col, i) => (
        <LogoColumn
          activeIndex={(indices[i] ?? 0) % col.length}
          delay={
            reduceMotion
              ? 0
              : (direction === "rtl" ? columns.length - 1 - i : i) *
                STAGGER_DELAY
          }
          key={i}
          logos={col}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}

const LogoColumn = memo(function LogoColumn({
  logos,
  activeIndex,
  delay,
  reduceMotion,
}: {
  logos: ReactNode[];
  activeIndex: number;
  delay: number;
  reduceMotion: boolean;
}) {
  return (
    <div className="relative overflow-hidden" data-slot="logos-carousel-column">
      {/* Invisible spacer — holds the column's natural height so absolutely
          positioned logos don't collapse the grid cell. */}
      <div
        aria-hidden="true"
        className="pointer-events-none invisible select-none"
      >
        {logos[0]}
      </div>

      <AnimatePresence initial={false} mode="sync">
        <motion.div
          animate={{
            opacity: 1,
            y: "0%",
            transition: reduceMotion
              ? { duration: 0 }
              : { ease: EASE, duration: 0.5, delay },
          }}
          className="absolute inset-0 flex items-center justify-center"
          data-slot="logos-carousel-logo"
          exit={
            reduceMotion
              ? undefined
              : {
                  opacity: 0,
                  y: "-60%",
                  transition: { ease: EASE, duration: 0.5, delay },
                }
          }
          initial={reduceMotion ? false : { opacity: 0, y: "60%" }}
          key={activeIndex}
        >
          {logos[activeIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

function distribute(logos: ReactNode[], count: number): ReactNode[][] {
  const n = Math.min(count, logos.length);
  const cols: ReactNode[][] = Array.from({ length: n }, () => []);
  logos.forEach((logo, i) => {
    cols[i % n].push(logo);
  });
  return cols;
}
