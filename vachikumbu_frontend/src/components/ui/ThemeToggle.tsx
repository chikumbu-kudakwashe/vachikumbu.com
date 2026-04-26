import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) return stored === "dark";
      return true; // Default to dark
    }
    return true;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="relative p-2 rounded-lg border border-border bg-card hover:bg-secondary transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      <Sun
        size={16}
        className={`transition-all duration-300 ${dark ? "opacity-0 rotate-90 scale-0 absolute inset-0 m-auto" : "opacity-100 rotate-0 scale-100"}`}
      />
      <Moon
        size={16}
        className={`transition-all duration-300 ${dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0 absolute inset-0 m-auto"}`}
      />
    </button>
  );
}
