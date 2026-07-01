import { useState,useEffect } from "react";
import { FileText, Search, Filter } from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { UploadZone } from "../components/documents/UploadZone";
import { DocumentRow } from "../components/documents/DocumentRow";
import { uploadDocument , getDocument, deleteDocument} from "../services/documentService";

export function DocumentsPage() {
  const [message, setMessage] = useState("");
  const [docs, setDocs] = useState([]);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try{
      const data = await getDocument();

      const formatted = data.map((doc ,index) => ({
        id:index,
        name:doc.filename,
        status: "indexed",
      }));
      setDocs(formatted)
    }
    catch(error){
      console.error("failed to load documents", error);
    }
  }

  const filtered = docs.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleUpload = async (file) => {
    if(!file) return ;

    try{
      setUploading(true);
      const result = await uploadDocument(file);

      setMessage(
        `${result.filename} uploaded successfully`
      );

      await loadDocuments();

    }
    
    catch(error){
      console.error("Upload failed:", error);
      setMessage("Upload failed. Please try again.");
    }
    finally{
      setUploading(false);
    }
  };

  const handleDelete = async (doc) => {
    try{
      await deleteDocument(doc.name);

      setMessage(`${doc.name} deleted successfully`);

      await loadDocuments();
    }
    catch(error){
      console.error(error);
      setMessage("Failed to delete document");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Documents" subtitle={`${docs.length} files indexed`} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

          {/* Upload zone */}
          <div>
            <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Upload documents</h2>
            <UploadZone onUpload={handleUpload} />

{uploading && (
  <div className="mt-3 flex items-center gap-2 text-xs text-surface-500">
    <div className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    Uploading and processing…
  </div>
)}

{message && (
  <div className="mt-3 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
    {message}
  </div>
)}
          </div>

          {/* Document list */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300">Your documents</h2>
              <div className="flex-1" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700">
                <Search size={13} className="text-surface-400 shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search documents…"
                  className="text-xs bg-transparent text-surface-700 dark:text-surface-300 placeholder-surface-400 outline-none w-36"
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-surface-400">
                <FileText size={32} className="mb-3 opacity-40" />
                <p className="text-sm font-medium">No documents found</p>
                <p className="text-xs mt-1">Upload your first document above</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2.5 border-b border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-950/50">
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">File</p>
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">Status</p>
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wider w-7" />
                </div>
                <div className="divide-y divide-surface-100 dark:divide-surface-800/60 p-2">
                  {filtered.map((doc) => (
                    <DocumentRow key={doc.id} doc={doc} onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-900/50">
            <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-800 dark:text-brand-300">Supported formats</p>
              <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5">
                PDF, TXT, and Markdown (.md) files up to 50 MB each. Documents are chunked and embedded automatically after upload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
