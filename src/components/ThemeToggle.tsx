"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    // Check if theme is already set in localStorage or document
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "light") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLight(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isLight ? "dark" : "light";
    setIsLight(!isLight);
    
    if (newTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2.5 px-3 py-2 rounded-md transition-all mb-0.5 text-[13px] font-medium text-foreground/60 hover:bg-muted hover:text-foreground w-full text-left"
      style={{
        color: "var(--foreground)",
        opacity: 0.8,
        background: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--muted)";
        e.currentTarget.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.opacity = "0.8";
      }}
    >
      {isLight ? <Moon size={15} /> : <Sun size={15} />}
      <span>{isLight ? "Dark Mode" : "Light Mode"}</span>
    </button>
  );
}
