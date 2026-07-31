import { useNavigate, useParams } from "react-router-dom";
import { MessageSquare, Search, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getChats, deleteChat } from "../../services/chatService";

export function ChatSidebar({ open = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const { chatId } = useParams();

  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    getChats()
      .then((data) => { if (active) setChats(data); })
      .catch((error) => console.error("Failed to load chats:", error));
    return () => { active = false; };
  }, [chatId]);

  const loadChats = async () => {
    try {
      const data = await getChats();
      setChats(data);
    } catch (err) {
      console.error("Failed to load chats:", err);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this chat?");
    if (!ok) return;

    try {
      await deleteChat(id);

      await loadChats();

      if (Number(chatId) === id) {
        navigate("/chat/new");
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {open && <button aria-label="Close chat history" onClick={onClose} className="fixed inset-0 z-40 bg-black/40 xl:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] -translate-x-full flex-col border-r border-surface-200 bg-surface-50 transition-transform duration-200 dark:border-surface-800 dark:bg-surface-900 xl:static xl:z-auto xl:w-64 xl:max-w-none xl:translate-x-0 ${open ? "translate-x-0" : ""}`}>

      {/* Header */}
      <div className="p-3 border-b border-surface-200 dark:border-surface-800">
        <div className="mb-2 flex items-center justify-between xl:hidden"><span className="text-sm font-semibold">Chat history</span><button onClick={onClose} aria-label="Close chat history" className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"><X size={18} /></button></div>

        <button
          onClick={() => { navigate("/chat/new"); onClose(); }}
          className="mb-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
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
                onClick={() => { navigate(`/chat/${chat.id}`); onClose(); }}
                className={`group w-full text-left rounded-xl p-3 mb-2 transition-all duration-200 ${
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

                    <div className="flex items-center justify-between">

                      <p className="text-sm font-medium truncate text-surface-800 dark:text-surface-100">
                        {chat.title}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(chat.id);
                        }}
                        className="flex h-9 w-9 items-center justify-center opacity-100 transition-opacity xl:opacity-0 xl:group-hover:opacity-100"
                      >
                        <Trash2
                          size={14}
                          className="text-surface-400 hover:text-red-500"
                        />
                      </button>

                    </div>

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
      </aside>
    </>
  );
}
