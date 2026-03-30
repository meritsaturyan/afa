#!/usr/bin/env python3
"""
Remove duplicate header handlers that fight webpack or site-mobile-nav.js.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

STRAY_LANG_TO_SEARCH = re.compile(
    r"<script>\s*// Language dropdown toggle\s*[\s\S]*?"
    r"// Search \(lupa\): open input on click\s*[\s\S]*?</script>\s*",
    re.MULTILINE,
)


def brace_close(text: str, open_idx: int) -> int:
    """Index after `}` that matches `{` at open_idx, or -1."""
    depth = 0
    i = open_idx
    n = len(text)
    while i < n:
        c = text[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    return -1


def skip_ws(text: str, i: int) -> int:
    while i < len(text) and text[i] in " \t\n\r":
        i += 1
    return i


def remove_init_mobile_iife_block(text: str, iife_start: int) -> tuple[str, int] | None:
    """
    If text[iife_start:].startswith('(function () {'), remove through closing })();
    Returns (new_text, same_index) or None if no match.
    """
    prefix = "(function () {"
    if text[iife_start : iife_start + len(prefix)] != prefix:
        return None
    brace_open = iife_start + len(prefix) - 1
    body_end = brace_close(text, brace_open)
    if body_end < 0:
        return None
    j = skip_ws(text, body_end)
    if text[j : j + 4] != ")();":
        return None
    j = skip_ws(text, j + 4)
    return text[:iife_start] + text[j:], iife_start


def strip_init_mobile_from_scripts(text: str) -> str:
    """Remove every (function(){ function initMobileMenu...})(); inside <script> blocks."""
    out: list[str] = []
    pos = 0
    while True:
        low = text.lower().find("<script", pos)
        if low < 0:
            out.append(text[pos:])
            break
        out.append(text[pos:low])
        gt = text.find(">", low)
        if gt < 0:
            out.append(text[low:])
            break
        # skip non-JS scripts
        tag = text[low : gt + 1].lower()
        if "src=" in tag:
            scr_close = text.find("</script>", gt + 1)
            if scr_close < 0:
                out.append(text[low:])
                break
            out.append(text[low : scr_close + len("</script>")])
            pos = scr_close + len("</script>")
            continue
        close = text.find("</script>", gt + 1)
        if close < 0:
            out.append(text[low:])
            break
        inner = text[gt + 1 : close]
        inner_clean = inner
        search = 0
        while True:
            fn = inner_clean.find("function initMobileMenu()", search)
            if fn < 0:
                break
            paren = inner_clean.rfind("(function () {", 0, fn)
            if paren < 0:
                search = fn + 1
                continue
            res = remove_init_mobile_iife_block(inner_clean, paren)
            if res is None:
                search = fn + 1
                continue
            inner_clean, _ = res
            search = paren
        out.append(text[low : gt + 1])
        out.append(inner_clean)
        out.append(text[close : close + len("</script>")])
        pos = close + len("</script>")
    return "".join(out)


def should_clean(text: str) -> bool:
    return "__webpack_modules__" in text or "site-mobile-nav.js" in text


def dedupe_body(text: str) -> str:
    return re.sub(r"</body>\s*(?:\n\s*)*</body>", "</body>", text, flags=re.IGNORECASE)


def clean_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8", errors="replace")
    if not should_clean(text):
        return False
    orig = text
    text = STRAY_LANG_TO_SEARCH.sub("", text)
    text = strip_init_mobile_from_scripts(text)
    text = dedupe_body(text)
    if text == orig:
        return False
    path.write_text(text, encoding="utf-8")
    print("Cleaned:", path)
    return True


def main() -> None:
    n = 0
    for path in sorted(ROOT.rglob("*.html")):
        if clean_file(path):
            n += 1
    print("Files updated:", n)


if __name__ == "__main__":
    main()
