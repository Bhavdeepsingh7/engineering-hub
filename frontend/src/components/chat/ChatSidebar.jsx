import { useNavigate, useParams } from "react-router-dom";
import { MessageSquare, Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getChats } from "../../services/chatService";

export function ChatSidebar() {
  const navigate = useNavigate();
  const { chatId } = useParams();

  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await getChats();
      setChats(data);
    } catch (err) {
      console.error("Failed to load chats:", err);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-64 shrink-0 flex flex-col border-r border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900">

      {/* Header */}
      <div className="p-3 border-b border-surface-200 dark:border-surface-800">

        <button
          onClick={() => navigate("/chat/new")}
          className="w-full mb-3 flex items-center justify-center gap-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white py-2 text-sm font-medium transition"
        >
          <Plus size={16} />
          New Chat
        </button>

        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <Search size={14} className="text-surface-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="flex-1 bg-transparent text-xs outline-none text-surface-700 dark:text-surface-300 placeholder-surface-400"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">

        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-surface-400">
          Recent Chats
        </p>

        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10 text-surface-400">
            <MessageSquare size={26} className="opacity-40 mb-2" />
            <p className="text-xs">No chats found</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const active = Number(chatId) === chat.id;

            return (
              <button
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.id}`)}
                className={`w-full text-left rounded-xl p-3 mb-2 transition-all duration-200 ${
                  active
                    ? "bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm"
                    : "hover:bg-white dark:hover:bg-surface-800"
                }`}
              >
                <div className="flex gap-2 items-start">

                  <MessageSquare
                    size={14}
                    className={`mt-0.5 shrink-0 ${
                      active
                        ? "text-brand-500"
                        : "text-surface-400"
                    }`}
                  />

                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-medium truncate text-surface-800 dark:text-surface-100">
                      {chat.title}
                    </p>

                    <p className="text-xs text-surface-400 mt-0.5 truncate">
                      Chat #{chat.id}
                    </p>

                    <p className="text-[11px] text-surface-300 dark:text-surface-500 mt-1">
                      {new Date(chat.updated_at).toLocaleString()}
                    </p>

                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}