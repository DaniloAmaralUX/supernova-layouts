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
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Slot } from "@radix-ui/react-slot";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const controlCornerClassName =
  "rounded-lg supports-[corner-shape:squircle]:corner-squircle supports-[corner-shape:squircle]:rounded-[11px]";

const tooltipThemeClassName =
  "[--tt-surface:#111111] [--tt-foreground:#ffffff] dark:[--tt-surface:#f6f3ec] dark:[--tt-foreground:#111111]";

const tooltipContentClassName = cn(
  controlCornerClassName,
  "group/tooltip pointer-events-none relative z-50 max-w-60 whitespace-normal bg-[color:var(--tt-surface)] px-3 py-1.5 font-medium text-[color:var(--tt-foreground)] text-xs leading-snug shadow-[0_4px_24px_-4px_rgba(0,0,0,0.25)]"
);

const tooltipArrowClassName =
  "absolute h-2 w-2 rotate-45 bg-[color:var(--tt-surface)] group-data-[side=bottom]/tooltip:-top-1 group-data-[side=left]/tooltip:top-1/2 group-data-[side=right]/tooltip:top-1/2 group-data-[side=left]/tooltip:-right-1 group-data-[side=top]/tooltip:-bottom-1 group-data-[side=bottom]/tooltip:left-1/2 group-data-[side=right]/tooltip:-left-1 group-data-[side=top]/tooltip:left-1/2 group-data-[side=bottom]/tooltip:-translate-x-1/2 group-data-[side=top]/tooltip:-translate-x-1/2 group-data-[side=left]/tooltip:-translate-y-1/2 group-data-[side=right]/tooltip:-translate-y-1/2";

type Side = "top" | "bottom" | "left" | "right";
type TooltipTriggerElement = React.ReactElement<{
  "aria-describedby"?: string;
}>;

export interface TooltipProps {
  children: TooltipTriggerElement;
  content: string;
  side?: Side;
  delay?: number;
  className?: string;
}

const MAX_TOOLTIP_CHARACTERS = 80;

function isTooltipTriggerElement(
  node: React.ReactNode
): node is TooltipTriggerElement {
  return React.isValidElement(node) && node.type !== React.Fragment;
}

function mergeDescribedBy(...ids: Array<string | undefined>) {
  const merged = ids.filter(Boolean).join(" ");

  return merged.length > 0 ? merged : undefined;
}

export function Tooltip({
  children,
  content,
  side = "top",
  delay = 0.15,
  className,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const tooltipId = React.useId();
  const normalizedContent = content.trim();

  if (!isTooltipTriggerElement(children)) {
    throw new Error(
      "Tooltip expects a single element child so it can forward hover, focus, and accessibility props."
    );
  }

  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      (normalizedContent.length > MAX_TOOLTIP_CHARACTERS ||
        normalizedContent.includes("\n"))
    ) {
      console.warn(
        "Tooltip content should stay short, single-line, and non-interactive. Use Popover for longer or multiline content."
      );
    }
  }, [normalizedContent]);

  const childAriaDescribedBy = children.props["aria-describedby"];
  const triggerDescription = open
    ? mergeDescribedBy(childAriaDescribedBy, tooltipId)
    : childAriaDescribedBy;

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(true), delay * 1000);
  };
  const handleLeave = () => {
    clearTimeout(timeoutRef.current);
    setOpen(false);
  };

  React.useEffect(() => () => clearTimeout(timeoutRef.current), []);

  if (normalizedContent.length === 0) {
    return children;
  }

  return (
    <PopoverPrimitive.Root modal={false} onOpenChange={setOpen} open={open}>
      <PopoverPrimitive.Anchor asChild>
        <Slot
          aria-describedby={triggerDescription}
          onBlur={handleLeave}
          onFocus={handleEnter}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {children}
        </Slot>
      </PopoverPrimitive.Anchor>

      <AnimatePresence>
        {open && (
          <PopoverPrimitive.Portal forceMount>
            <PopoverPrimitive.Content
              align="center"
              asChild
              avoidCollisions
              collisionPadding={12}
              forceMount
              onCloseAutoFocus={(event) => event.preventDefault()}
              onOpenAutoFocus={(event) => event.preventDefault()}
              side={side}
              sideOffset={10}
            >
              <motion.div
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                className={cn(
                  tooltipThemeClassName,
                  tooltipContentClassName,
                  className
                )}
                exit={{
                  opacity: 0,
                  scale: 0.92,
                  filter: "blur(4px)",
                }}
                id={tooltipId}
                initial={{
                  opacity: 0,
                  scale: 0.92,
                  filter: "blur(4px)",
                }}
                role="tooltip"
                style={{
                  transformOrigin:
                    "var(--radix-popover-content-transform-origin)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 24,
                  mass: 0.6,
                }}
              >
                <motion.span
                  animate={{ scale: 1 }}
                  className={tooltipArrowClassName}
                  exit={{ scale: 0.95, opacity: 0 }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    delay: 0.03,
                  }}
                />
                {normalizedContent}
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  );
}

export { Tooltip as tooltip };
