from pathlib import Path

SUPPORTED_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".md",
    ".txt",
    ".json",
    ".yaml",
    ".yml",
    ".html",
    ".css",
}

SKIP_DIRS = {
    ".git",
    "node_modules",
    "venv",
    "__pycache__",
    "dist",
    "build",
}


def filter_files(tree):
    files = []

    for item in tree:
        if item["type"] != "blob":
            continue
        
        path = item["path"]

        if any(part in SKIP_DIRS for part in Path(path).parts):
            continue

        if Path(path).suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue

        files.append(item)

    return files