"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="fixed top-4 right-4 z-50 p-3 cursor-pointer rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Alternar tema"
    >
      <Sun className="h-5 w-5 text-purple-600 dark:text-purple-400 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 text-purple-600 dark:text-purple-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 top-3 left-3" />
      <span className="sr-only">Alternar tema</span>
    </button>
  );
}
