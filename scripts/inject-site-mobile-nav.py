#!/usr/bin/env python3
"""Insert <script defer src=site-mobile-nav.js> after layout CSS on pages that use header-nav."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PAIRS = [
    ('<link rel="stylesheet" href="footer-layout.css">', "site-mobile-nav.js"),
    ('<link rel="stylesheet" href="../footer-layout.css">', "../site-mobile-nav.js"),
    ('<link rel="stylesheet" href="header-nav.css">', "site-mobile-nav.js"),
    ('<link rel="stylesheet" href="../header-nav.css">', "../site-mobile-nav.js"),
]


def inject(path: Path) -> bool:
    text = path.read_text(encoding="utf-8", errors="replace")
    if "header-nav.css" not in text or "site-mobile-nav.js" in text:
        return False
    # Full home.js webpack bundle already wires menu + jQuery
    if "__webpack_modules__" in text:
        return False
    for needle, src in PAIRS:
        if needle in text:
            ins = needle + f'\n<script defer src="{src}"></script>'
            text = text.replace(needle, ins, 1)
            path.write_text(text, encoding="utf-8")
            print("Injected:", path)
            return True
    print("No anchor:", path)
    return False


def main() -> None:
    n = 0
    for path in sorted(ROOT.rglob("*.html")):
        if inject(path):
            n += 1
    print("Total:", n)


if __name__ == "__main__":
    main()
