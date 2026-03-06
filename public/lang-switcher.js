/**
 * Language switcher: same-page navigation for am/ru/en.
 * Inline copy is used in each HTML page; this file is reference only.
 * - currentLang from path (/ru/ -> ru, /en/ -> en, else am)
 * - currentFile from path; fallback to index.html if not in knownPages
 * - Sets #lang_dropdown .lang_link href from data-lang and updates #lang_btn text.
 */
