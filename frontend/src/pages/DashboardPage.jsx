import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, FolderGit2, MessageSquare, Database, ArrowRight, Upload } from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import api from "../services/api";

function Stat({ icon: Icon, label, value, tone }) {
  return <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}><Icon size={18}/></div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-surface-400">{label}</p></div>;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [data, setData] = useState();
  useEffect(() => { api.get("/dashboard/summary").then((response) => setData(response.data)).catch(() => setData({ total_documents: 0, total_repositories: 0, total_indexed_chunks: 0, total_chats: 0, recent_chats: [] })); }, []);
  if (!data) return <div className="flex h-full flex-col"><TopBar title="Dashboard" subtitle="Loading your workspace"/><div className="p-6 text-sm text-surface-400">Loading dashboard…</div></div>;
  return <div className="flex h-full flex-col overflow-hidden"><TopBar title="Dashboard" subtitle="Your engineering knowledge at a glance"/><main className="flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-5xl space-y-7 animate-fade-in">
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><Stat icon={FileText} label="Total documents" value={data.total_documents} tone="bg-brand-50 text-brand-600 dark:bg-brand-950/40"/><Stat icon={FolderGit2} label="GitHub repositories" value={data.total_repositories} tone="bg-violet-50 text-violet-600 dark:bg-violet-950/40"/><Stat icon={Database} label="Indexed chunks" value={data.total_indexed_chunks} tone="bg-amber-50 text-amber-600 dark:bg-amber-950/40"/><Stat icon={MessageSquare} label="Total chats" value={data.total_chats} tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"/></div>
    <div className="grid gap-4 sm:grid-cols-2"><button onClick={() => navigate("/chat/new")} className="flex items-center gap-3 rounded-2xl border border-surface-200 bg-white p-5 text-left dark:border-surface-800 dark:bg-surface-900"><MessageSquare className="text-brand-600"/><span><b className="block text-sm">Start a chat</b><small className="text-surface-400">Ask about your indexed knowledge</small></span><ArrowRight className="ml-auto" size={16}/></button><button onClick={() => navigate("/documents")} className="flex items-center gap-3 rounded-2xl border border-surface-200 bg-white p-5 text-left dark:border-surface-800 dark:bg-surface-900"><Upload className="text-brand-600"/><span><b className="block text-sm">Upload a document</b><small className="text-surface-400">Add a new source to your workspace</small></span><ArrowRight className="ml-auto" size={16}/></button></div>
    <section className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900"><h2 className="mb-3 text-sm font-semibold">Recent chats</h2>{data.recent_chats.length ? <div className="space-y-2">{data.recent_chats.map((chat) => <button key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)} className="flex w-full items-center justify-between rounded-xl p-3 text-left hover:bg-surface-50 dark:hover:bg-surface-800"><span className="text-sm">{chat.title}</span><span className="text-xs text-surface-400">{new Date(chat.updated_at).toLocaleDateString()}</span></button>)}</div> : <p className="text-sm text-surface-400">No chats yet. Start one to see it here.</p>}</section>
    {data.last_uploaded_document && <p className="text-xs text-surface-400">Last uploaded document: <span className="font-medium text-surface-600 dark:text-surface-300">{data.last_uploaded_document.filename}</span></p>}
    {data.last_imported_repository && <p className="text-xs text-surface-400">Last imported repository: <span className="font-medium text-surface-600 dark:text-surface-300">{data.last_imported_repository.owner}/{data.last_imported_repository.repo}</span></p>}
  </div></main></div>;
}
