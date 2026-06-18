import { useNavigate } from "react-router-dom";
import { FileText, MessageSquare, Zap, TrendingUp, ArrowRight, Clock, Upload } from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { mockStats, mockChats, mockDocuments } from "../services/mockData";

function StatCard({ icon: Icon, label, value, trend, color }) {
  return (
    <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5 hover:shadow-md hover:shadow-surface-100/50 dark:hover:shadow-black/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={17} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp size={11} />
            {trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-0.5">{value}</p>
      <p className="text-xs text-surface-400">{label}</p>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Dashboard" subtitle="Welcome back, Arjun" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={FileText} label="Documents indexed" value={mockStats.documents} trend="+2 this week" color="bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400" />
            <StatCard icon={MessageSquare} label="Active chats" value={mockStats.chats} trend="+5 today" color="bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400" />
            <StatCard icon={Zap} label="Queries answered" value={mockStats.queries} trend="+12 today" color="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400" />
            <StatCard icon={TrendingUp} label="Tokens used" value={mockStats.tokensUsed} color="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" />
          </div>

          {/* Quick actions */}
          <div>
            <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Quick actions</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/chat/new")}
                className="flex items-center gap-4 p-4 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-md shadow-brand-600/30 group-hover:scale-105 transition-transform">
                  <MessageSquare size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">Start new chat</p>
                  <p className="text-xs text-surface-400 mt-0.5">Ask anything about your docs</p>
                </div>
                <ArrowRight size={15} className="ml-auto text-surface-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </button>
              <button
                onClick={() => navigate("/documents")}
                className="flex items-center gap-4 p-4 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shadow-violet-600/30 group-hover:scale-105 transition-transform">
                  <Upload size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">Upload document</p>
                  <p className="text-xs text-surface-400 mt-0.5">PDF, TXT, or Markdown</p>
                </div>
                <ArrowRight size={15} className="ml-auto text-surface-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* Recent activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent chats */}
            <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Recent chats</h3>
                <button onClick={() => navigate("/chat")} className="text-xs text-brand-600 dark:text-brand-400 hover:underline">View all</button>
              </div>
              <div className="space-y-2">
                {mockChats.slice(0, 3).map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => navigate(`/chat/${chat.id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center shrink-0">
                      <MessageSquare size={13} className="text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate">{chat.title}</p>
                      <p className="text-xs text-surface-400 truncate">{chat.preview}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-surface-300 dark:text-surface-600 shrink-0">
                      <Clock size={10} />
                      {chat.updatedAt}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent documents */}
            <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Recent documents</h3>
                <button onClick={() => navigate("/documents")} className="text-xs text-brand-600 dark:text-brand-400 hover:underline">View all</button>
              </div>
              <div className="space-y-2">
                {mockDocuments.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0">
                      <FileText size={13} className="text-brand-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate">{doc.name}</p>
                      <p className="text-xs text-surface-400">{doc.size} · {doc.uploadedAt}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
                      doc.status === "indexed"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
