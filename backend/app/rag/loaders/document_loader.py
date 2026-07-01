from app.rag.loaders.pdf_loader import extract_pdf_text
from app.rag.loaders.pptx_loader import extract_pptx_text
from app.rag.loaders.md_loader import extract_md_text
from app.rag.loaders.txt_loader import extract_txt_text
from pathlib import Path 

def load_document(file_path):

    ext = Path(file_path).suffix.lower()

    if ext == ".pdf":
        return extract_pdf_text(file_path)

    elif ext == ".pptx":
        return extract_pptx_text(file_path)

    elif ext == ".md":
        return extract_md_text(file_path)

    elif ext == ".txt":
        return extract_txt_text(file_path)

    raise ValueError("Unsupported file type")