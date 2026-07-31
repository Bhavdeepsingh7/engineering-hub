import { useEffect, useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { useTheme } from "../hooks/useTheme";
import { getApiKeyStatus ,saveApiKey} from "../services/settingsService";
import { useUser } from "@clerk/clerk-react";

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">{title}</h3>
      </div>
      <div className="space-y-4 p-4 sm:p-5">{children}</div>
    </div>
  );
}

function Row({ label, desc, children }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{label}</p>
        {desc && <p className="text-xs text-surface-400 mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const providers = ["gemini", "openai", "anthropic", "groq", "openrouter"];

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const [geminiKey, setGeminiKey] = useState("")
  const [configured, setConfigured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [providerKeys, setProviderKeys] = useState({});
  const [providerStatus, setProviderStatus] = useState({});


  useEffect(() => {
    Promise.all(providers.map(async (provider) => [provider, await getApiKeyStatus(provider)])).then((entries) => setProviderStatus(Object.fromEntries(entries.map(([provider, data]) => [provider, data.configured]))));
  }, []);

  const profileName = user?.fullName || user?.primaryEmailAddress?.emailAddress || "Account";
  const profileEmail = user?.primaryEmailAddress?.emailAddress || "";

  const handleSaveGeminiKey = async () => {
    try {

        setSaving(true);

        await saveApiKey(
            "gemini",
            geminiKey,
        );

        setConfigured(true);
        setGeminiKey("");

    } catch (err) {
        console.error(err);
    } finally {
        setSaving(false);
    }
};



  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Settings" subtitle="Manage your account and preferences" />
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">

          {/* Profile */}
          <Section title="Profile">
            <div className="flex flex-wrap items-center gap-3 border-b border-surface-100 pb-4 dark:border-surface-800 sm:flex-nowrap sm:gap-4">
              {user?.imageUrl ? (
                <img className="w-14 h-14 rounded-2xl object-cover shadow-md shadow-brand-600/25" src={user.imageUrl} alt={`${profileName} profile`} />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-600/25">
                  {profileName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-surface-900 dark:text-surface-100">{profileName}</p>
                <p className="truncate text-xs text-surface-400">{profileEmail}</p>
              </div>
              <a href="https://accounts.clerk.com/user" className="min-h-11 text-xs font-medium text-brand-600 hover:underline dark:text-brand-400 sm:ml-auto">Manage profile</a>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-surface-600 dark:text-surface-400 block mb-1.5">Full name</label>
                <input
                  value={profileName}
                  readOnly
                  className="w-full text-sm px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-surface-200 placeholder-surface-400 outline-none focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-50 dark:focus:ring-brand-950/50 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-surface-600 dark:text-surface-400 block mb-1.5">Email address</label>
                <input
                  value={profileEmail}
                  readOnly
                  className="w-full text-sm px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-800 dark:text-surface-200 placeholder-surface-400 outline-none focus:border-brand-400 dark:focus:border-brand-600 focus:ring-2 focus:ring-brand-50 dark:focus:ring-brand-950/50 transition-all"
                />
              </div>
              <p className="text-xs text-surface-400">Name, email, and profile image are managed through your sign-in account.</p>
            </div>
          </Section>


          <Section title="Model Providers">

  <Row
    label="Gemini API Key"
    desc={
      configured
        ? "A Gemini API key is already configured."
        : "Provide your own Gemini API key to power chat and embeddings."
    }
  >
    {configured && (
      <span className="text-xs font-medium text-emerald-600">
        ✓ Configured
      </span>
    )}
  </Row>

  <input
    type="password"
    value={geminiKey}
    onChange={(e) => setGeminiKey(e.target.value)}
    placeholder={
      configured
        ? "Enter a new key to replace the existing one"
        : "Enter Gemini API Key"
    }
    className="w-full text-sm px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 outline-none"
  />

  <button
    onClick={handleSaveGeminiKey}
    disabled={!geminiKey || saving}
    className="min-h-11 w-full rounded-lg bg-brand-600 px-4 py-2 text-white disabled:opacity-50 sm:w-auto"
  >
    {saving ? "Saving..." : "Save API Key"}
  </button>

</Section>

          <div className="space-y-3">
            {providers.filter((provider) => provider !== "gemini").map((provider) => <Section key={provider} title={provider === "anthropic" ? "Anthropic Claude" : provider[0].toUpperCase() + provider.slice(1)}>
              <div className="flex flex-col gap-2 sm:flex-row"><input type="password" value={providerKeys[provider] || ""} onChange={(event) => setProviderKeys({ ...providerKeys, [provider]: event.target.value })} placeholder={`Enter ${provider} API key`} className="min-h-11 flex-1 text-sm px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 outline-none"/><button onClick={async () => { await saveApiKey(provider, providerKeys[provider]); setProviderStatus({ ...providerStatus, [provider]: true }); setProviderKeys({ ...providerKeys, [provider]: "" }); }} disabled={!providerKeys[provider]} className="min-h-11 rounded-lg bg-brand-600 px-3 py-2 text-xs text-white disabled:opacity-50">Save</button></div>
              {providerStatus[provider] && <p className="text-xs text-emerald-600">Connected</p>}
            </Section>)}
          </div>

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
        </div>
      </div>
    </div>
  );
}
