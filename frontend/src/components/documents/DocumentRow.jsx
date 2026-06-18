import { FileText, File, Trash2, CheckCircle, Clock } from "lucide-react";
import { Badge } from "../common/Badge";

const icons = { pdf: File, md: FileText, txt: FileText };

export function DocumentRow({ doc, onDelete }) {
  const Icon = icons[doc.type] || FileText;
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 group transition-all border border-transparent hover:border-surface-200 dark:hover:border-surface-700">
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
        onClick={() => onDelete(doc.id)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-surface-300 dark:text-surface-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
