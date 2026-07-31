import { FileText, File, Trash2, CheckCircle, Clock } from "lucide-react";
import { Badge } from "../common/Badge";

const icons = { pdf: File, md: FileText, txt: FileText };

export function DocumentRow({ doc, onDelete }) {
  const Icon = icons[doc.type] || FileText;
  return (
    <div className="group flex flex-wrap items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition-all hover:border-surface-200 hover:bg-surface-50 dark:hover:border-surface-700 dark:hover:bg-surface-800/50 sm:flex-nowrap sm:gap-4 sm:px-4">
      <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-brand-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{doc.name}</p>
        <p className="text-xs text-surface-400 mt-0.5">{doc.size} · Uploaded {doc.uploadedAt}</p>
      </div>
      <Badge variant={doc.status === "indexed" ? "success" : "warning"}>
        {doc.status === "indexed" ? (
          <span className="flex items-center gap-1"><CheckCircle size={10} /> Indexed</span>
        ) : (
          <span className="flex items-center gap-1"><Clock size={10} /> Processing</span>
        )}
      </Badge>
      <button
        onClick={() => onDelete(doc)}
        aria-label={`Delete ${doc.name}`}
        className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg text-surface-400 transition-all hover:bg-red-50 hover:text-red-500 dark:text-surface-600 dark:hover:bg-red-900/20 sm:h-9 sm:w-9 sm:opacity-0 sm:group-hover:opacity-100"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
