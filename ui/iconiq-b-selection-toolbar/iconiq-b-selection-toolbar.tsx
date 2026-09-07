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
import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";
import * as React from "react";
import { createPortal } from "react-dom";

import {
  getSelectionToolbarButtonClassName,
  getSelectionToolbarShortcutLabel,
  isSelectionToolbarCommandActive,
  type SelectionToolbarItem,
  type SelectionToolbarProps,
  selectionToolbarStyles,
  useSelectionToolbar,
} from "./selectiontoolbar";

export type {
  SelectionToolbarCommand,
  SelectionToolbarItem,
  SelectionToolbarProps,
} from "./selectiontoolbar";

type ToolbarButtonProps = {
  active?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  label: string;
  onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => void;
  shortcut?: string;
  tabIndex?: number;
};

const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  function ToolbarButton(
    {
      active = false,
      children,
      className,
      disabled = false,
      label,
      onMouseDown,
      shortcut,
      tabIndex = -1,
    },
    ref
  ) {
    return (
      <ToolbarPrimitive.Button
        aria-keyshortcuts={shortcut}
        aria-label={shortcut ? `${label} (${shortcut})` : label}
        aria-pressed={active}
        className={getSelectionToolbarButtonClassName({ active, className })}
        disabled={disabled}
        onMouseDown={onMouseDown}
        ref={ref}
        tabIndex={tabIndex}
        title={shortcut ? `${label} (${shortcut})` : label}
        type="button"
      >
        <span className={selectionToolbarStyles.toolbarButtonIconClassName}>
          {children}
        </span>
      </ToolbarPrimitive.Button>
    );
  }
);

ToolbarButton.displayName = "SelectionToolbarButton";

function renderToolbarItems({
  active,
  buttonRefs,
  disabled,
  focusedIndex,
  handleItemAction,
  items,
}: {
  active: ReturnType<typeof useSelectionToolbar>["active"];
  buttonRefs: ReturnType<typeof useSelectionToolbar>["buttonRefs"];
  disabled: boolean;
  focusedIndex: number;
  handleItemAction: (item: SelectionToolbarItem) => void;
  items: SelectionToolbarItem[];
}) {
  return items.map((item, index) => (
    <ToolbarButton
      active={
        item.command
          ? isSelectionToolbarCommandActive(item.command, active)
          : false
      }
      disabled={disabled || item.disabled}
      key={item.id}
      label={item.label}
      onMouseDown={(event) => {
        event.preventDefault();
        handleItemAction(item);
      }}
      ref={(node) => {
        buttonRefs.current[index] = node;
      }}
      shortcut={
        item.command
          ? getSelectionToolbarShortcutLabel(item.command)
          : undefined
      }
      tabIndex={focusedIndex === index ? 0 : -1}
    >
      {item.icon}
    </ToolbarButton>
  ));
}

export function SelectionToolbar(props: SelectionToolbarProps) {
  const toolbar = useSelectionToolbar(props);

  if (!(toolbar.mounted && toolbar.portalTarget)) {
    return null;
  }

  return createPortal(
    <ToolbarPrimitive.Root
      aria-controls={toolbar.ariaControls}
      aria-hidden={!toolbar.visible}
      aria-label="Text formatting"
      className={toolbar.shellClassName}
      onKeyDown={toolbar.handleToolbarKeyDown}
      onMouseDown={(event) => event.preventDefault()}
      orientation="horizontal"
      ref={toolbar.setToolbarNode}
      style={toolbar.toolbarStyle}
    >
      {renderToolbarItems({
        active: toolbar.active,
        buttonRefs: toolbar.buttonRefs,
        disabled: toolbar.disabled,
        focusedIndex: toolbar.focusedIndex,
        handleItemAction: toolbar.handleItemAction,
        items: toolbar.resolvedItems,
      })}
      {toolbar.children}
    </ToolbarPrimitive.Root>,
    toolbar.portalTarget
  );
}

SelectionToolbar.displayName = "SelectionToolbar";

export { ToolbarButton };
