import { Sun, Moon, Bell } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export function TopBar({ title, subtitle }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950">
      <div>
        <h1 className="text-sm font-semibold text-surface-900 dark:text-surface-50">{title}</h1>
        {subtitle && <p className="text-xs text-surface-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all relative">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
