import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FileText, Copy, Check } from "lucide-react";
import { useState } from "react";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="absolute top-2 right-2 p-1 rounded text-surface-400 hover:text-surface-200 hover:bg-white/10 transition-colors">
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

export function MessageBubble({ message }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="max-w-[72%] bg-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className="text-xs text-brand-200 mt-1 text-right">{message.timestamp}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-slide-up">
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
        <span className="text-white text-xs font-bold">AI</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-surface-50 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <div className="prose-custom text-sm">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!inline && match) {
                    return (
                      <div className="relative">
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ borderRadius: "0.75rem", margin: "0.5rem 0", fontSize: "0.8rem" }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                        <CopyButton text={String(children)} />
                      </div>
                    );
                  }
                  return <code className={className} {...props}>{children}</code>;
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {message.sources?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
              <p className="text-xs font-medium text-surface-400 dark:text-surface-500 mb-1.5">Sources</p>
              <div className="flex flex-wrap gap-1.5">
                {message.sources.map((src) => (
                  <div key={src} className="flex items-center gap-1 px-2 py-1 rounded-md bg-surface-100 dark:bg-surface-700 text-xs text-surface-600 dark:text-surface-300">
                    <FileText size={11} className="text-brand-500" />
                    {src}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-surface-400 mt-1 ml-1">{message.timestamp}</p>
      </div>
    </div>
  );
}
