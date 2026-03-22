#!/usr/bin/env python3
"""
Split footer_nav_col--links into:
  - footer_nav_col--join (Անդամակցել + submenu)
  - footer_nav_col--quick (Գործունեություն, Անդամներ, Նորություններ, Միջոցառումներ)
Run from repo root: python3 scripts/split_footer_join_quick.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

LINKS_KEY = '<div class="footer_nav_col footer_nav_col--links">'


def extract_balanced_ul(html: str, ul_open_idx: int) -> tuple[str, int] | None:
    tag_end = html.find(">", ul_open_idx)
    if tag_end < 0:
        return None
    inner_start = tag_end + 1
    depth = 1
    pos = inner_start
    while depth > 0 and pos < len(html):
        next_open = html.find("<ul", pos)
        next_close = html.find("</ul>", pos)
        if next_close < 0:
            return None
        if 0 <= next_open < next_close:
            depth += 1
            pos = next_open + 3
        else:
            depth -= 1
            if depth == 0:
                inner = html[inner_start:next_close]
                return inner, next_close + len("</ul>")
            pos = next_close + 5
    return None


def split_top_level_lis(fragment: str) -> list[str]:
    items: list[str] = []
    i = 0
    while True:
        idx = fragment.find("<li", i)
        if idx < 0:
            break
        depth_li = 1
        pos = idx + 3
        while depth_li > 0 and pos < len(fragment):
            open_li = fragment.find("<li", pos)
            close_li = fragment.find("</li>", pos)
            if close_li < 0:
                break
            if open_li >= 0 and open_li < close_li:
                depth_li += 1
                pos = open_li + 3
            else:
                depth_li -= 1
                if depth_li == 0:
                    items.append(fragment[idx : close_li + len("</li>")])
                    i = close_li + len("</li>")
                    break
                pos = close_li + len("</li>")
        else:
            break
    return items


def process_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8", errors="replace")
    if "footer_nav_col--join" in text:
        return False
    start = text.find(LINKS_KEY)
    if start < 0:
        return False
    ul_pos = text.find('<ul class="menu_list menu_list--footer">', start)
    if ul_pos < 0:
        return False
    extracted = extract_balanced_ul(text, ul_pos)
    if not extracted:
        return False
    inner, after_ul = extracted
    m = re.match(r"\s*</div>", text[after_ul:])
    if not m:
        return False
    end = after_ul + m.end()
    lis = split_top_level_lis(inner.strip())
    if len(lis) != 5:
        print(f"SKIP {path}: expected 5 <li> in links column, got {len(lis)}", file=sys.stderr)
        return False
    activity, join, members, news, events = lis
    new_block = f"""                            <div class="footer_nav_col footer_nav_col--join">
                                <ul class="menu_list menu_list--footer">
                                    {join.strip()}
                                </ul>
                            </div>
                            <div class="footer_nav_col footer_nav_col--quick">
                                <ul class="menu_list menu_list--footer">
                                    {activity.strip()}
                                    {members.strip()}
                                    {news.strip()}
                                    {events.strip()}
                                </ul>
                            </div>"""
    new_text = text[:start] + new_block + text[end:]
    path.write_text(new_text, encoding="utf-8")
    return True


def main() -> None:
    n = 0
    for path in sorted(ROOT.rglob("*.html")):
        if "node_modules" in path.parts:
            continue
        try:
            if process_file(path):
                n += 1
                print(path.relative_to(ROOT))
        except Exception as e:
            print(f"ERR {path}: {e}", file=sys.stderr)
    print(f"Updated {n} files.")


if __name__ == "__main__":
    main()
