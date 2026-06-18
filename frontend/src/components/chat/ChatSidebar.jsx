import { useNavigate, useParams } from "react-router-dom";
import { MessageSquare, Search, Trash2 } from "lucide-react";
import { mockChats } from "../../services/mockData";

export function ChatSidebar() {
  const navigate = useNavigate();
  const { chatId } = useParams();

  return (
    <div className="w-56 shrink-0 flex flex-col border-r border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900">
      <div className="p-3 border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <Search size={13} className="text-surface-400 shrink-0" />
          <input className="flex-1 text-xs bg-transparent text-surface-700 dark:text-surface-300 placeholder-surface-400 outline-none" placeholder="Search chats…" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        <p className="px-2 pb-1 text-xs font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">Recent</p>
        {mockChats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => navigate(`/chat/${chat.id}`)}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group ${
              chatId === chat.id
                ? "bg-white dark:bg-surface-800 shadow-sm border border-surface-200 dark:border-surface-700"
                : "hover:bg-white dark:hover:bg-surface-800"
            }`}
          >
            <div className="flex items-start gap-2">
              <MessageSquare size={13} className={`mt-0.5 shrink-0 ${chatId === chat.id ? "text-brand-500" : "text-surface-400"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate leading-snug">{chat.title}</p>
                <p className="text-xs text-surface-400 truncate mt-0.5">{chat.preview}</p>
              </div>
            </div>
            <p className="text-xs text-surface-300 dark:text-surface-600 mt-1 ml-5">{chat.updatedAt}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
