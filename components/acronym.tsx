"use client";

import { useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Position = { left: number; top: number };

function fitToViewport(left: number, top: number): Position {
  const width = Math.min(300, window.innerWidth - 24);
  return {
    left: Math.max(12, Math.min(left, window.innerWidth - width - 12)),
    top: Math.max(12, Math.min(top, window.innerHeight - 104)),
  };
}

export function Acronym({ title, href, children }: { title: string; href?: string; children: ReactNode }) {
  const id = useId();
  const trigger = useRef<HTMLSpanElement>(null);
  const hideTimer = useRef<number | null>(null);
  const [position, setPosition] = useState<Position | null>(null);

  function cancelHide() {
    if (hideTimer.current !== null) window.clearTimeout(hideTimer.current);
    hideTimer.current = null;
  }

  function scheduleHide() {
    cancelHide();
    hideTimer.current = window.setTimeout(() => setPosition(null), 120);
  }

  function showByPointer(event: MouseEvent<HTMLSpanElement>) {
    cancelHide();
    setPosition(fitToViewport(event.clientX + 16, event.clientY + 16));
  }

  function showByFocus() {
    cancelHide();
    const box = trigger.current?.getBoundingClientRect();
    if (box) setPosition(fitToViewport(box.right + 12, box.top));
  }

  return <>
    <span
      ref={trigger}
      className="acronym-tooltip"
      tabIndex={0}
      aria-describedby={position ? id : undefined}
      onMouseEnter={showByPointer}
      onMouseMove={showByPointer}
      onMouseLeave={scheduleHide}
      onFocus={showByFocus}
      onBlur={scheduleHide}
    >
      <abbr title={title}>{children}</abbr>
    </span>
    {position && createPortal(
      <span id={id} className="acronym-floating" role="tooltip" style={position} onMouseEnter={cancelHide} onMouseLeave={scheduleHide} onFocus={cancelHide} onBlur={scheduleHide}>
        <strong>{title}</strong>
        {href && <a href={href}>Learn more</a>}
      </span>,
      document.body,
    )}
  </>;
}
