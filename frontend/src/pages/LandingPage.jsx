import { useNavigate } from "react-router-dom";
import { Zap, FileText, MessageSquare, Search, Code2, Shield, ArrowRight, GitBranch, ChevronRight } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { Sun, Moon } from "lucide-react";

const features = [
  { icon: FileText, title: "Document Ingestion", desc: "Upload PDFs, markdown, and text files. We chunk, embed, and index everything automatically." },
  { icon: MessageSquare, title: "Conversational Q&A", desc: "Ask natural language questions and get precise answers grounded in your actual documentation." },
  { icon: Code2, title: "Code-Aware Responses", desc: "AI understands code snippets, architecture diagrams, and technical specifications." },
  { icon: Search, title: "Semantic Search", desc: "Find relevant context across all your docs, even when you don't know the exact wording." },
  { icon: Shield, title: "Source Citations", desc: "Every answer links to the source file so you can verify and explore further." },
  { icon: Zap, title: "Instant Indexing", desc: "Documents are processed and searchable in seconds, not minutes." },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 text-surface-900 dark:text-surface-50">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-surface-100 dark:border-surface-800 bg-white/80 dark:bg-surface-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold">EI Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center text-surface-400 hover:text-surface-700 dark:hover:text-surface-200">
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={() => navigate("/dashboard")} className="text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors">
              Sign in
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Now with GPT-4 powered semantic search
            <ChevronRight size={12} />
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
            Engineering intelligence,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">on demand</span>
          </h1>

          <p className="text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Chat with engineering documentation, codebases, and architecture knowledge. Stop digging through wikis — ask a question and get a precise, cited answer in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 hover:-translate-y-0.5"
            >
              Get Started — it's free
              <ArrowRight size={16} />
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 font-medium text-sm hover:bg-surface-50 dark:hover:bg-surface-800 transition-all">
              <GitBranch size={15} />
              View on GitHub
            </button>
          </div>

          {/* Hero visual */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-surface-950 z-10 pointer-events-none" style={{ top: "60%" }} />
            <div className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 shadow-2xl shadow-surface-200/50 dark:shadow-black/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-200 dark:border-surface-800">
                <div className="flex gap-1.5">{["bg-red-400","bg-amber-400","bg-emerald-400"].map(c => <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />)}</div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-surface-400 font-mono">Engineering Intelligence Hub</span>
                </div>
              </div>
              <div className="p-6 space-y-4 text-left">
                <div className="flex justify-end">
                  <div className="max-w-sm bg-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm">
                    How does our JWT refresh token rotation work?
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-surface-700 dark:text-surface-300 max-w-lg">
                    <p className="font-medium text-surface-900 dark:text-surface-100 mb-1">JWT Refresh Token Rotation</p>
                    <p>Refresh tokens are rotated on every use. When a client presents a refresh token, the server issues a new one and invalidates the old…</p>
                    <div className="mt-2 flex gap-1.5">
                      {["auth.md", "security.md"].map(s => <span key={s} className="text-xs bg-surface-100 dark:bg-surface-700 px-2 py-0.5 rounded text-surface-500 dark:text-surface-400">📄 {s}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-surface-50 dark:bg-surface-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-3">Capabilities</p>
            <h2 className="text-3xl font-bold tracking-tight">Built for engineering teams</h2>
            <p className="text-surface-500 dark:text-surface-400 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Every feature designed around how engineers actually look up information — not how product managers write wikis.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg hover:shadow-brand-100/50 dark:hover:shadow-brand-950/50 transition-all duration-200 group">
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mb-4 group-hover:bg-brand-100 dark:group-hover:bg-brand-950/60 transition-colors">
                  <Icon size={17} className="text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm mb-1.5">{title}</h3>
                <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to make your docs useful?</h2>
          <p className="text-surface-500 dark:text-surface-400 mb-8 text-sm">Upload your first document in under a minute. No credit card required.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40 hover:-translate-y-0.5"
          >
            Get Started — free
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-100 dark:border-surface-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-brand-600 flex items-center justify-center">
              <Zap size={10} className="text-white" />
            </div>
            <span className="text-xs text-surface-400">Engineering Intelligence Hub</span>
          </div>
          <p className="text-xs text-surface-400">© 2025 EI Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
