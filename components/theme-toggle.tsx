"use client";
import { useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  function toggle() {
    const next = !document.documentElement.classList.contains("dark"); setDark(next); document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("sqloptima-theme", next ? "dark" : "light");
  }
  return <button className="theme" type="button" onClick={toggle} aria-label="Toggle color theme">{dark ? "Light" : "Theme"}</button>;
}
