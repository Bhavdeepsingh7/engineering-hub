import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Paperclip, Zap, MessageSquare, ArrowUp } from "lucide-react";
import { ChatSidebar } from "../components/chat/ChatSidebar";
import { MessageBubble } from "../components/chat/MessageBubble";
import { TypingIndicator } from "../components/chat/TypingIndicator";
import { mockMessages } from "../services/mockData";
import { sendMessage } from "../services/api";

const SUGGESTIONS = [
  "How does JWT token refresh work?",
  "What's the Kubernetes pod config for the API?",
  "Explain our rate limiting strategy",
  "What database indexes are recommended?",
];

export function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const isNew = !chatId || chatId === "new";

  useEffect(() => {
    if (chatId && mockMessages[chatId]) {
      setMessages(mockMessages[chatId]);
    } else if (isNew) {
      setMessages([]);
    }
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { content, sources } = await sendMessage(chatId, text);
      const aiMsg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content,
        sources,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      <ChatSidebar />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-surface-950">
        {/* Header */}
        <div className="h-14 flex items-center px-5 border-b border-surface-200 dark:border-surface-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-surface-900 dark:text-surface-50 leading-none">
                {isNew ? "New conversation" : `Chat #${chatId}`}
              </h1>
              <p className="text-xs text-surface-400 mt-0.5">5 documents in context</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {messages.length === 0 && isNew ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mb-5 shadow-lg shadow-brand-600/30">
                <MessageSquare size={24} className="text-white" />
              </div>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">What would you like to know?</h2>
              <p className="text-sm text-surface-400 max-w-sm mb-8">
                Ask anything about your engineering documentation, architecture, or code.
              </p>
              <div className="grid sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-left px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-xs text-surface-600 dark:text-surface-400 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-950/30 hover:text-brand-700 dark:hover:text-brand-300 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {loading && <TypingIndicator />}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="px-5 py-4 border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950">
          <div className="relative flex items-end gap-2 bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-2xl px-4 py-3 focus-within:border-brand-400 dark:focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100 dark:focus-within:ring-brand-950/50 transition-all">
            <button className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors shrink-0 mb-0.5">
              <Paperclip size={16} />
            </button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
              }}
              onKeyDown={handleKey}
              placeholder="Ask about your documentation…"
              rows={1}
              className="flex-1 bg-transparent text-sm text-surface-800 dark:text-surface-200 placeholder-surface-400 resize-none outline-none max-h-40 leading-relaxed"
              style={{ height: "24px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 hover:scale-105 active:scale-95 shadow-sm"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowUp size={15} />
              )}
            </button>
          </div>
          <p className="text-center text-xs text-surface-300 dark:text-surface-600 mt-2">
            EI Hub can make mistakes. Verify important information in source documents.
          </p>
        </div>
      </div>
    </div>
  );
}
