import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, MessageSquare, Settings, Zap, ChevronRight, Plus } from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/documents", icon: FileText, label: "Documents" },
  { to: "/chat", icon: MessageSquare, label: "Chats" },
  { to: "/github", icon: Zap, label: "GitHub" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="w-60 shrink-0 h-screen flex flex-col bg-surface-50 dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-surface-900 dark:text-surface-50 leading-none block">EI Hub</span>
            <span className="text-xs text-surface-400 dark:text-surface-500">Engineering Intelligence</span>
          </div>
        </div>
      </div>

      {/* New Chat CTA */}
      <div className="px-3 pt-4">
        <button
          onClick={() => navigate("/chat/new")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/30 hover:bg-brand-100 dark:hover:bg-brand-950/50 transition-colors duration-150"
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
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
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
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold">
            AK
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate">Arjun Kumar</p>
            <p className="text-xs text-surface-400 truncate">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
