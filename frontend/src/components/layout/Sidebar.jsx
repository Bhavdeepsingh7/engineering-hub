import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, MessageSquare, Settings, Zap, ChevronRight, Plus, X } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/documents", icon: FileText, label: "Documents" },
  { to: "/chat", icon: MessageSquare, label: "Chats" },
  { to: "/github", icon: Zap, label: "GitHub" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const displayName = user?.fullName || user?.primaryEmailAddress?.emailAddress || "Account";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const closeAndNavigate = (to) => {
    navigate(to);
    onClose();
  };

  return (
    <>
      {open && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-40 bg-black/40 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] -translate-x-full flex-col border-r border-surface-200 bg-surface-50 transition-transform duration-200 dark:border-surface-800 dark:bg-surface-900 lg:static lg:z-auto lg:w-60 lg:max-w-none lg:translate-x-0 ${open ? "translate-x-0" : ""}`}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <button aria-label="Close navigation" onClick={onClose} className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 lg:hidden"><X size={18} /></button>
          <div>
            <span className="text-sm font-semibold text-surface-900 dark:text-surface-50 leading-none block">EI Hub</span>
            <span className="text-xs text-surface-400 dark:text-surface-500">Engineering Intelligence</span>
          </div>
        </div>
      </div>

      {/* New Chat CTA */}
      <div className="px-3 pt-4">
        <button
          onClick={() => closeAndNavigate("/chat/new")}
          className="flex min-h-11 w-full items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 transition-colors duration-150 hover:bg-brand-100 dark:bg-brand-950/30 dark:text-brand-400 dark:hover:bg-brand-950/50"
        >
          <Plus size={15} />
          New Chat
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-3 pb-2 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-white dark:bg-surface-800 text-brand-600 dark:text-brand-400 shadow-sm border border-surface-200 dark:border-surface-700"
                  : "text-surface-600 dark:text-surface-400 hover:bg-white dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? "text-brand-600 dark:text-brand-400" : "text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-300"} />
                {label}
                {isActive && <ChevronRight size={13} className="ml-auto text-brand-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-3">
          {user?.imageUrl ? (
            <img className="w-7 h-7 rounded-full" src={user.imageUrl} alt={`${displayName} profile`} />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate">{displayName}</p>
          </div>
        </div>
      </div>
      </aside>
    </>
  );
}
