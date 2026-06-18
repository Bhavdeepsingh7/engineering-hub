import { useState } from "react";
import { Sun, Moon, Monitor, User, Bell, Shield, Plug, ChevronRight, Check, Zap, GitBranch, Hash, Box } from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { useTheme } from "../hooks/useTheme";

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{label}</p>
        {desc && <p className="text-xs text-surface-400 mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-10 h-5.5 rounded-full transition-colors duration-200 flex items-center ${value ? "bg-brand-600" : "bg-surface-200 dark:bg-surface-700"}`}
      style={{ height: "22px" }}
    >
      <span className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ml-0.5 ${value ? "translate-x-4.5" : "translate-x-0"}`}
        style={{ transform: value ? "translateX(18px)" : "translateX(0)" }}
      />
    </button>
  );
}

const integrations = [
  { icon: GitBranch, name: "GitHub", desc: "Sync repositories and READMEs", connected: true },
  { icon: Hash, name: "Slack", desc: "Get answers directly in Slack", connected: false },
  { icon: Box, name: "Figma", desc: "Import design documentation", connected: false },
  { icon: Zap, name: "Zapier", desc: "Automate document ingestion", connected: false },
];

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [notifs, setNotifs] = useState({ email: true, browser: false, digest: true });
  const [profileName, setProfileName] = useState("Arjun Kumar");
  const [profileEmail, setProfileEmail] = useState("arjun@example.com");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Settings" subtitle="Manage your account and preferences" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">

          {/* Profile */}
          <Section title="Profile">
            <div className="flex items-center gap-4 pb-4 border-b border-surface-100 dark:border-surface-800">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-600/25">
                AK
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{profileName}</p>
                <p className="text-xs text-surface-400">{profileEmail}</p>
                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 text-xs font-medium">Pro Plan</span>
              </div>
              <button className="ml-auto text-xs text-brand-600 dark:text-brand-400 font-medium hover:underline">Change avatar</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-surface-600 dark:text-surface-400 block mb-1.5">Full name</label>
                <input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-surface-200 placeholder-surface-400 outline-none focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-50 dark:focus:ring-brand-950/50 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-surface-600 dark:text-surface-400 block mb-1.5">Email address</label>
                <input
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-surface-200 placeholder-surface-400 outline-none focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-50 dark:focus:ring-brand-950/50 transition-all"
                />
              </div>
              <button className="px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-700 transition-colors shadow-sm">
                Save changes
              </button>
            </div>
          </Section>

          {/* Appearance */}
          <Section title="Appearance">
            <div>
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200 mb-3">Theme</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "light", icon: Sun, label: "Light" },
                  { value: "dark", icon: Moon, label: "Dark" },
                  { value: "system", icon: Monitor, label: "System" },
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => { if (value !== "system") { if (theme !== value) toggleTheme(); } }}
                    className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border transition-all ${
                      theme === value
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
                        : "border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600"
                    }`}
                  >
                    <Icon size={16} className={theme === value ? "text-brand-600 dark:text-brand-400" : "text-surface-400"} />
                    <span className={`text-xs font-medium ${theme === value ? "text-brand-700 dark:text-brand-300" : "text-surface-500 dark:text-surface-400"}`}>{label}</span>
                    {theme === value && <Check size={11} className="text-brand-600 dark:text-brand-400" />}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Notifications */}
          <Section title="Notifications">
            <Row label="Email notifications" desc="Receive summaries and alerts by email">
              <Toggle value={notifs.email} onChange={(v) => setNotifs((n) => ({ ...n, email: v }))} />
            </Row>
            <Row label="Browser notifications" desc="Get real-time alerts in your browser">
              <Toggle value={notifs.browser} onChange={(v) => setNotifs((n) => ({ ...n, browser: v }))} />
            </Row>
            <Row label="Weekly digest" desc="Summary of activity every Monday">
              <Toggle value={notifs.digest} onChange={(v) => setNotifs((n) => ({ ...n, digest: v }))} />
            </Row>
          </Section>

          {/* Integrations */}
          <Section title="Integrations">
            <p className="text-xs text-surface-400 -mt-1 mb-2">Connect your tools to automatically sync documentation.</p>
            <div className="space-y-2">
              {integrations.map(({ icon: Icon, name, desc, connected }) => (
                <div key={name} className="flex items-center gap-3 p-3.5 rounded-xl border border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-surface-600 dark:text-surface-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{name}</p>
                    <p className="text-xs text-surface-400 truncate">{desc}</p>
                  </div>
                  {connected ? (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check size={12} /> Connected
                    </span>
                  ) : (
                    <button className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                      Connect <ChevronRight size={11} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Danger zone */}
          <Section title="Danger zone">
            <Row label="Delete account" desc="Permanently delete your account and all data">
              <button className="px-3.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                Delete account
              </button>
            </Row>
          </Section>
        </div>
      </div>
    </div>
  );
}
