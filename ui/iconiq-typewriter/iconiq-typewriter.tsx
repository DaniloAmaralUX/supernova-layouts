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
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export interface TextTypewriterProps {
  children: string;
  className?: string;
  duration?: number;
}

const WRONG_CHARS = "!@#$%^&*()QWERTY";

function randomWrongChar() {
  return WRONG_CHARS[Math.floor(Math.random() * WRONG_CHARS.length)];
}

export default function TextTypewriter({
  children,
  className,
  duration = 3,
}: TextTypewriterProps) {
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const timeouts = new Set<ReturnType<typeof setTimeout>>();
    const speed = duration / 3;

    const schedule = (callback: () => void, ms: number) => {
      const id = setTimeout(callback, ms * speed);
      timeouts.add(id);
    };

    const runAnimation = () => {
      let currentText = "";
      let targetIndex = 0;
      const finalText = children;

      const typeChar = () => {
        if (targetIndex >= finalText.length) {
          setText(finalText);
          setShowCursor(false);
          schedule(() => {
            setShowCursor(true);
            runAnimation();
          }, 1000);
          return;
        }

        const targetChar = finalText[targetIndex];
        const shouldGlitch = Math.random() > 0.6 && targetChar !== " ";

        if (shouldGlitch) {
          currentText += randomWrongChar();
          setText(currentText);

          schedule(
            () => {
              currentText = currentText.slice(0, -1);
              setText(currentText);

              schedule(() => {
                if (Math.random() > 0.5) {
                  currentText += randomWrongChar();
                  setText(currentText);

                  schedule(() => {
                    currentText = currentText.slice(0, -1);
                    setText(currentText);

                    schedule(() => {
                      currentText += targetChar;
                      setText(currentText);
                      targetIndex++;
                      schedule(typeChar, 50 + Math.random() * 100);
                    }, 80);
                  }, 120);
                } else {
                  currentText += targetChar;
                  setText(currentText);
                  targetIndex++;
                  schedule(typeChar, 50 + Math.random() * 100);
                }
              }, 80);
            },
            100 + Math.random() * 150
          );
        } else {
          currentText += targetChar;
          setText(currentText);
          targetIndex++;
          schedule(typeChar, 40 + Math.random() * 80);
        }
      };

      setText("");
      setShowCursor(true);
      schedule(typeChar, 500);
    };

    runAnimation();

    return () => {
      for (const id of timeouts) {
        clearTimeout(id);
      }
      timeouts.clear();
    };
  }, [children, duration]);

  return (
    <div className={cn(className)}>
      <span aria-live="polite">
        {text}
        {showCursor ? (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            aria-hidden
            transition={{
              duration: 0.8,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            |
          </motion.span>
        ) : null}
      </span>
    </div>
  );
}
