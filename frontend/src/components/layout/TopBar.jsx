import { Sun, Moon, Bell, LogOut, Settings, User, Menu } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useLayout } from "./LayoutContext";

export function TopBar({ title, subtitle }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const { openNavigation } = useLayout();
  return (
    <header className="flex min-h-14 items-center justify-between gap-2 border-b border-surface-200 bg-white px-3 dark:border-surface-800 dark:bg-surface-950 sm:px-6">
      <div className="flex min-w-0 items-center gap-1">
        <button onClick={openNavigation} aria-label="Open navigation" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 lg:hidden"><Menu size={19} /></button>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-surface-900 dark:text-surface-50">{title}</h1>
          {subtitle && <p className="truncate text-xs text-surface-400">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-surface-400 transition-all hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-800 dark:hover:text-surface-200"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-lg text-surface-400 transition-all hover:bg-surface-100 hover:text-surface-700 dark:hover:bg-surface-800 dark:hover:text-surface-200">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full" />
        </button>
        <div className="relative ml-2">
          <button onClick={() => setOpen((value) => !value)} className="flex min-h-11 items-center gap-2 rounded-lg px-1 py-1 hover:bg-surface-100 dark:hover:bg-surface-800">
            <img className="h-7 w-7 rounded-full" src={user?.imageUrl} alt="User avatar" />
            <span className="hidden sm:block max-w-32 truncate text-xs font-medium text-surface-700 dark:text-surface-200">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</span>
          </button>
          {open && <div className="absolute right-0 mt-2 w-56 rounded-xl border border-surface-200 bg-white p-2 shadow-lg dark:border-surface-700 dark:bg-surface-900 z-30">
            <div className="px-2 py-2 border-b border-surface-100 dark:border-surface-800"><p className="truncate text-xs font-semibold">{user?.fullName || "Profile"}</p><p className="truncate text-xs text-surface-400">{user?.primaryEmailAddress?.emailAddress}</p></div>
            <Link to="/settings" className="mt-1 flex items-center gap-2 rounded-lg px-2 py-2 text-xs hover:bg-surface-100 dark:hover:bg-surface-800"><Settings size={14}/> Settings</Link>
            <a href="https://accounts.clerk.com/user" className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs hover:bg-surface-100 dark:hover:bg-surface-800"><User size={14}/> Profile</a>
            <button onClick={() => signOut({ redirectUrl: "/login" })} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"><LogOut size={14}/> Logout</button>
          </div>}
        </div>
      </div>
    </header>
  );
}
