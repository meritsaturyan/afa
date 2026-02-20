#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Add initLangDropdown script before </body> to all HTML files that have lang_dropdown but not initLangDropdown."""

import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))

SCRIPT_BLOCK = '''
    <script>
        (function() {
            function initLangDropdown() {
                var btn = document.getElementById('lang_btn');
                var dropdown = document.getElementById('lang_dropdown');
                var lgBlock = btn && btn.closest && btn.closest('.lg_block');
                if (!btn || !dropdown || !lgBlock) return;
                function openDropdown() {
                    lgBlock.classList.add('opened');
                    dropdown.style.display = 'block';
                }
                function closeDropdown() {
                    lgBlock.classList.remove('opened');
                    dropdown.style.display = '';
                }
                function toggleDropdown(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (lgBlock.classList.contains('opened')) closeDropdown();
                    else openDropdown();
                }
                btn.addEventListener('click', toggleDropdown);
                dropdown.addEventListener('click', function(e) { e.stopPropagation(); });
                document.addEventListener('click', function(e) {
                    if (lgBlock.classList.contains('opened') && !lgBlock.contains(e.target)) closeDropdown();
                });
            }
            if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLangDropdown);
            else initLangDropdown();
        })();
    </script>
'''

def process(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'id="lang_dropdown"' not in content or 'initLangDropdown' in content:
        return False
    # Insert before </body>
    if '</body>' not in content:
        return False
    new_content = content.replace('</body>', SCRIPT_BLOCK + '\n</body>', 1)
    if new_content == content:
        return False
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True

def main():
    for root, dirs, files in os.walk(BASE):
        dirs[:] = [d for d in dirs if d not in ('node_modules', '.git')]
        for name in files:
            if name.endswith('.html'):
                path = os.path.join(root, name)
                if process(path):
                    print('Added:', path)

if __name__ == '__main__':
    main()
