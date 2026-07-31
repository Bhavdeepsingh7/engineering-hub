import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { LayoutContext } from "./LayoutContext";

export function AppLayout() {
  const [navigationOpen, setNavigationOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = navigationOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [navigationOpen]);

  return (
    <LayoutContext.Provider value={{ openNavigation: () => setNavigationOpen(true) }}>
      <div className="flex h-dvh overflow-hidden bg-white dark:bg-surface-950">
        <Sidebar open={navigationOpen} onClose={() => setNavigationOpen(false)} />
        <div className="flex-1 flex min-w-0 flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </LayoutContext.Provider>
  );
}
