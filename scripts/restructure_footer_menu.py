#!/usr/bin/env python3
"""
Split footer_menu single-grid <ul> into three independent columns (fixes row-1 height bug).
Run from repo root: python3 scripts/restructure_footer_menu.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def extract_balanced_ul(html: str, ul_open_idx: int) -> tuple[str, int] | None:
    """Return inner HTML of ul starting at ul_open_idx, and index after closing </ul>."""
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
    """Split direct children <li>...</li> of an outer fragment (handles nested <li> in submenus)."""
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


def normalize_markup(s: str) -> str:
    s = re.sub(
        r'<ul class="menu_list"\s+style="position:\s*relative;\s*height:\s*279px;">',
        '<ul class="menu_list menu_list--footer">',
        s,
        count=1,
    )
    s = re.sub(
        r'<ul class="menu_list"\s+style="[^"]*position:\s*relative[^"]*">',
        '<ul class="menu_list menu_list--footer">',
        s,
        count=1,
    )
    s = re.sub(r'<li style="position:\s*absolute[^"]*">', "<li>", s)
    return s


def build_new_footer_menu(lis: list[str]) -> str:
    if len(lis) != 7:
        raise ValueError(f"expected 7 <li> items, got {len(lis)}")
    about, join, activity, members, news, events, feedback = [normalize_markup(x) for x in lis]
    return f"""                    <div class="footer_menu">
                        <div class="footer_nav_columns">
                            <div class="footer_nav_col footer_nav_col--about">
                                <ul class="menu_list menu_list--footer">
                                    {about}
                                </ul>
                            </div>
                            <div class="footer_nav_col footer_nav_col--join">
                                <ul class="menu_list menu_list--footer">
                                    {join}
                                </ul>
                            </div>
                            <div class="footer_nav_col footer_nav_col--quick">
                                <ul class="menu_list menu_list--footer">
                                    {activity}
                                    {members}
                                    {news}
                                    {events}
                                </ul>
                            </div>
                            <div class="footer_nav_col footer_nav_col--feedback">
                                <ul class="menu_list menu_list--footer">
                                    {feedback}
                                </ul>
                            </div>
                        </div>

                    </div>
"""


def process_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8", errors="replace")
    if "footer_nav_columns" in text:
        return False
    fm = text.find('<div class="footer_menu">')
    fc = text.find('<div class="footer_contacts">')
    if fm < 0 or fc < 0 or fm > fc:
        return False
    block = text[fm:fc]
    ul_pos = block.find('<ul class="menu_list"')
    if ul_pos < 0:
        return False
    abs_ul = fm + ul_pos
    extracted = extract_balanced_ul(text, abs_ul)
    if not extracted:
        return False
    inner, _after_ul = extracted
    lis = split_top_level_lis(inner.strip())
    if len(lis) != 7:
        print(f"SKIP {path}: got {len(lis)} lis", file=sys.stderr)
        return False
    try:
        new_menu = build_new_footer_menu(lis)
    except ValueError as e:
        print(f"SKIP {path}: {e}", file=sys.stderr)
        return False
    new_text = text[:fm] + new_menu + text[fc:]
    path.write_text(new_text, encoding="utf-8")
    return True


def main() -> None:
    patterns = ["*.html"]
    count = 0
    for pat in patterns:
        for path in sorted(ROOT.rglob(pat)):
            if "node_modules" in path.parts:
                continue
            try:
                if process_file(path):
                    count += 1
                    print(path.relative_to(ROOT))
            except Exception as e:
                print(f"ERR {path}: {e}", file=sys.stderr)
    print(f"Updated {count} files.")


if __name__ == "__main__":
    main()
