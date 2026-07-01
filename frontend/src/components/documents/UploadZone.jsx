import { useState, useRef } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";

const ACCEPTED = [".pdf", ".txt", ".md"];

export function UploadZone({ onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const validate = (files) => {
    const valid = [];
    const invalid = [];
    Array.from(files).forEach((f) => {
      const ext = "." + f.name.split(".").pop().toLowerCase();
      if (ACCEPTED.includes(ext)) valid.push(f);
      else invalid.push(f.name);
    });
    if (invalid.length) setError(`Unsupported: ${invalid.join(", ")}. Use PDF, TXT, or MD.`);
    else setError("");
    if (valid.length) onUpload(valid[0]);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); validate(e.dataTransfer.files); }}
      onClick={() => inputRef.current.click()}
      className={`group cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
        dragging
          ? "border-brand-500 bg-brand-50 dark:bg-brand-950/20"
          : "border-surface-200 dark:border-surface-700 hover:border-brand-400 hover:bg-surface-50 dark:hover:bg-surface-800/50"
      }`}
    >
      <input ref={inputRef} type="file" multiple accept=".pdf,.txt,.md" className="hidden" onChange={(e) => validate(e.target.files)} />
      <div className={`mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
        dragging ? "bg-brand-100 dark:bg-brand-900/30" : "bg-surface-100 dark:bg-surface-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20"
      }`}>
        <Upload size={20} className={dragging ? "text-brand-600 dark:text-brand-400" : "text-surface-400 group-hover:text-brand-500 transition-colors"} />
      </div>
      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">Drop files here or <span className="text-brand-600 dark:text-brand-400">browse</span></p>
      <p className="text-xs text-surface-400 mt-1">Supports PDF, TXT, and Markdown files</p>
      {error && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-red-500 justify-center">
          <AlertCircle size={12} /> {error}
        </div>
      )}
    </div>
  );
}
