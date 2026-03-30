#!/usr/bin/env python3
"""Remove truncated webpack <script>").attr... bundles and inject site-mobile-nav.js."""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CORRUPT_START = '\n    <script>").attr(e.scriptAttrs || {}).prop({'

JQ_BLOCK = re.compile(
    r"\s*<script>\s*// Обработчик для предотвращения закрытия меню при клике на ссылки в подменю[\s\S]*?</script>",
    re.MULTILINE,
)


def script_src(path: Path) -> str:
    p = path.as_posix()
    if p.startswith("en/") or p.startswith("ru/"):
        return "../site-mobile-nav.js"
    return "site-mobile-nav.js"


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8", errors="replace")
    if CORRUPT_START not in text:
        return False
    start = text.find(CORRUPT_START)
    needle = "window.$ = window.jQuery = t()"
    j = text.find(needle, start)
    if j == -1:
        print(f"[skip] no jQuery tail: {path}", file=sys.stderr)
        return False
    end = text.find("\n    </script>", j)
    if end == -1:
        print(f"[skip] no </script>: {path}", file=sys.stderr)
        return False
    end += len("\n    </script>")
    rel = script_src(path)
    inject = f'\n    <script defer src="{rel}"></script>'
    new_text = text[:start] + inject + text[end:]
    new_text, n = JQ_BLOCK.subn("\n", new_text, count=1)
    path.write_text(new_text, encoding="utf-8")
    print(f"Patched ({n} jq blocks removed): {path}")
    return True


def main() -> None:
    n = 0
    for path in sorted(ROOT.rglob("*.html")):
        if patch_file(path):
            n += 1
    print(f"Done. Patched {n} files.")


if __name__ == "__main__":
    main()
