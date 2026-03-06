import pathlib


ROOT = pathlib.Path(__file__).resolve().parent


def read_text(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: pathlib.Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def extract_div_block(html: str, marker: str) -> str:
    start = html.find(marker)
    if start == -1:
        return ""
    i = start
    depth = 0
    end = -1
    while i < len(html):
        if html.startswith("<div", i):
            depth += 1
            i = html.find(">", i)
            if i == -1:
                break
        elif html.startswith("</div>", i):
            depth -= 1
            i += len("</div>")
            if depth == 0:
                end = i
                break
        else:
            i += 1
    if end == -1:
        return ""
    return html[start:end]


def extract_between(html: str, start_marker: str, end_marker: str) -> str:
    start = html.find(start_marker)
    if start == -1:
        return ""
    end = html.find(end_marker, start)
    if end == -1:
        return ""
    return html[start:end]


def get_canonical_pieces():
    """
    Эталонные header'ы:
    - am: из корневого index.html
    - ru: из ru/mermasin.html
    - en: из en/mermasin.html
    Эталонный мобильный CSS – из задания (жёстко заданный текстом).
    """
    index_html = read_text(ROOT / "index.html")
    ru_mermasin = read_text(ROOT / "ru" / "mermasin.html")
    en_mermasin = read_text(ROOT / "en" / "mermasin.html")

    am_header = extract_div_block(index_html, '<div class="header">').strip()
    ru_header = extract_div_block(ru_mermasin, '<div class="header">').strip()
    en_header = extract_div_block(en_mermasin, '<div class="header">').strip()

    css_block = """
/* ====== MOBILE HEADER (copy from index.html) ====== */
@media screen and (max-width: 767px) {
  .header {
    background: #fff;
    box-shadow: none;
    padding-bottom: 8px;
    padding-top: max(8px, env(safe-area-inset-top));
    position: sticky;
    top: 0;
    z-index: 999;
  }

  .header_main {
    display: grid !important;
    grid-template-columns: 80px 1fr 128px !important;
    grid-template-areas: "logo title actions" !important;
    align-items: center !important;
    column-gap: 10px !important;
    padding: 6px 0 !important;
    min-height: 92px !important;
    height: auto !important;
    overflow: visible !important;
  }

  .header .main_logo {
    grid-area: logo !important;
    background: #fff !important;
    margin: 0 !important;
    padding-right: 6px !important;
    align-self: center !important;
    overflow: visible !important;
  }

  .header .main_logo img {
    width: 74px !important;
    height: 74px !important;
    min-width: 74px !important;
    min-height: 74px !important;
    max-width: 74px !important;
    max-height: 74px !important;
    border-radius: 50% !important;
    object-fit: contain !important;
    display: block !important;
  }

  .header_org_name {
    grid-area: title !important;
    justify-self: center !important;
    text-align: center !important;
    font-size: 14px !important;
    line-height: 1.15 !important;
    font-weight: 600 !important;
    color: #212529 !important;
    margin: 0 !important;
    padding: 0 !important;
    margin-top: 4px !important;
    padding-top: 2px !important;
    display: block !important;
    -webkit-line-clamp: unset !important;
    -webkit-box-orient: unset !important;
    overflow: visible !important;
    text-overflow: unset !important;
    white-space: normal !important;
    max-width: 100% !important;
    min-width: 0 !important;
    transform: translateY(0) !important;
  }

  .header_actions {
    grid-area: actions !important;
    display: flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 8px !important;
    min-width: 128px !important;
    max-width: 128px !important;
  }

  .header_actions .search_block { order: 1 !important; margin-top: 4px !important; }
  .header_actions .lg_block { order: 2 !important; }
  .header_actions .menu_btn { order: 3 !important; }

  .header .search_block form {
    width: 44px !important;
    height: 44px !important;
    padding: 0 !important;
    background: transparent !important;
  }

  .header .search_block button[type=submit] {
    position: static !important;
    width: 44px !important;
    height: 44px !important;
    margin: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .header .lg_block { margin-left: 0 !important; height: auto !important; }
  .header .lg_block .drop_btn {
    height: 44px !important;
    padding: 0 10px !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 6px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
  }

  .header .menu_btn {
    width: 44px !important;
    height: 44px !important;
    margin-left: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    position: relative !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .header .menu_btn:before,
  .header .menu_btn:after,
  .header .menu_btn span {
    content: "" !important;
    position: absolute !important;
    left: 11px !important;
    right: 11px !important;
    height: 2px !important;
    background: currentColor !important;
    border: none !important;
    width: auto !important;
    transition: transform .25s ease, opacity .2s ease, top .25s ease !important;
  }

  .header .menu_btn:before { top: 14px !important; }
  .header .menu_btn span { top: 21px !important; }
  .header .menu_btn:after { top: 28px !important; }

  body.menu_opened .header .menu_btn span { opacity: 0 !important; }
  body.menu_opened .header .menu_btn:before { top: 21px !important; transform: rotate(45deg) !important; }
  body.menu_opened .header .menu_btn:after { top: 21px !important; transform: rotate(-45deg) !important; }

  .content { padding-top: 0 !important; }
  .main_slider { margin-top: 0 !important; }
}

/* MENU DUPLICATES FIX */
@media screen and (min-width: 960px) {
  .mobile_only { display: none !important; }
  .second_menu .menu_list>li>a {
    font-family: GAAGayane-Regular, montserrat, montserratarm;
    font-weight: 400 !important;
  }
}
@media screen and (max-width: 959px) {
  .second_menu { display: none !important; }
  .mobile_only { display: block !important; }
  .header .menu_block .menu_list>li>a {
    font-family: GAAGayane-Regular, montserrat, montserratarm;
    font-weight: 400 !important;
  }
}
""".strip()

    # JS-блок для языкового переключателя: всегда ведём на index.* нужного языка
    lang_js = """
    <script>
        (function () {
            var path = window.location.pathname || '';
            var parts = path.split('/').filter(Boolean);
            var inRu = parts.indexOf('ru') >= 0;
            var inEn = parts.indexOf('en') >= 0;
            var btn = document.getElementById('lang_btn');
            var links = document.querySelectorAll('#lang_dropdown .lang_link');
            if (!btn || links.length < 3) return;

            function setHref(el, href) {
                if (el) el.setAttribute('href', href);
            }

            if (inRu) {
                btn.textContent = 'ru';
                setHref(links[0], '../index.html');       // am
                setHref(links[1], './');                 // ru
                setHref(links[2], '../en/index.html');   // en
            } else if (inEn) {
                btn.textContent = 'en';
                setHref(links[0], '../index.html');       // am
                setHref(links[1], '../ru/index.html');    // ru
                setHref(links[2], './');                  // en
            } else {
                btn.textContent = 'am';
                setHref(links[0], './');          // am
                setHref(links[1], './ru/');       // ru
                setHref(links[2], './en/');       // en
            }
        })();
    </script>
    """.strip()

    return {
        "am_header": am_header,
        "ru_header": ru_header,
        "en_header": en_header,
        "css_block": css_block,
        "lang_js": lang_js,
    }


def replace_header(content: str, new_header: str) -> str:
    """
    Находим первый блок <div class="header">...</div> с учётом вложенных div
    и жёстко заменяем его на new_header.
    """
    marker = '<div class="header">'
    start = content.find(marker)
    if start == -1:
        return content
    i = start
    depth = 0
    end = -1
    length = len(content)
    while i < length:
        if content.startswith("<div", i):
            depth += 1
            i = content.find(">", i)
            if i == -1:
                break
        elif content.startswith("</div>", i):
            depth -= 1
            i += len("</div>")
            if depth == 0:
                end = i
                break
        else:
            i += 1
    if end == -1:
        return content
    return content[:start] + new_header + content[end:]


def ensure_css(content: str, css_block: str) -> str:
    """
    Всегда просто дописываем блок в конец <style>, чтобы он перебивал старые стили.
    """
    style_end = content.find("</style>")
    if style_end == -1:
        return content
    before = content[:style_end]
    after = content[style_end:]
    return before.rstrip() + "\n\n" + css_block + "\n" + after


def ensure_js(content: str, lang_js: str) -> str:
    """
    Заменяем старый JS-блок для языкового переключателя на новый lang_js.
    Ищем по маркеру "var path = window.location.pathname".
    """
    marker = "var path = window.location.pathname"
    idx = content.find(marker)
    if idx == -1:
        return content
    script_start = content.rfind("<script", 0, idx)
    if script_start == -1:
        return content
    script_end = content.find("</script>", idx)
    if script_end == -1:
        return content
    script_end += len("</script>")
    return content[:script_start] + "\n" + lang_js + "\n" + content[script_end:]


def build_header_for_path(base_header: str, path: pathlib.Path) -> str:
    """
    Берём эталонный header из index.html и правим только относительные пути
    для logo и переключателя языков.
    """
    # Сейчас base_header уже локализован и содержит корректные пути
    return base_header


def process_file(path: pathlib.Path, pieces) -> bool:
    content = read_text(path)
    original = content

    rel = str(path)
    if "/ru/" in rel:
        header = build_header_for_path(pieces["ru_header"], path)
    elif "/en/" in rel:
        header = build_header_for_path(pieces["en_header"], path)
    else:
        header = build_header_for_path(pieces["am_header"], path)

    if header:
        content = replace_header(content, header)

    if pieces["css_block"]:
        content = ensure_css(content, pieces["css_block"])

    content = ensure_js(content, pieces["lang_js"])

    if content != original:
        write_text(path, content)
        return True
    return False


def main():
    pieces = get_canonical_pieces()
    html_files = [
        "andamakcutyan_hayt.html",
        "andamner.html",
        "ashxatatexer.html",
        "gorcakir.html",
        "gorcuneutyun.html",
        "gorcynkerner.html",
        "gorcynkerner_new.html",
        "hetadardk_kap.html",
        "inchuandamakcel.html",
        "index.html",
        "khorhurd.html",
        "mermasin.html",
        "mijotsaranner.html",
        "norutyunner.html",
        "tsarayutyunner.html",
        "ru/andamakcutyan_hayt.html",
        "ru/andamner.html",
        "ru/ashxatatexer.html",
        "ru/gorcakir.html",
        "ru/gorcuneutyun.html",
        "ru/gorcynkerner.html",
        "ru/gorcynkerner_new.html",
        "ru/hetadardk_kap.html",
        "ru/inchuandamakcel.html",
        "ru/index.html",
        "ru/khorhurd.html",
        "ru/mermasin.html",
        "ru/mijotsaranner.html",
        "ru/norutyunner.html",
        "ru/tsarayutyunner.html",
        "en/andamakcutyan_hayt.html",
        "en/andamner.html",
        "en/ashxatatexer.html",
        "en/gorcakir.html",
        "en/gorcuneutyun.html",
        "en/gorcynkerner.html",
        "en/gorcynkerner_new.html",
        "en/hetadardk_kap.html",
        "en/inchuandamakcel.html",
        "en/index.html",
        "en/khorhurd.html",
        "en/mermasin.html",
        "en/mijotsaranner.html",
        "en/norutyunner.html",
        "en/tsarayutyunner.html",
    ]
    changed = []
    for rel in html_files:
        path = ROOT / rel
        if not path.exists():
            continue
        if process_file(path, pieces):
            changed.append(rel)

    if changed:
        print("Updated files:")
        for f in changed:
            print(f)
    else:
        print("No changes applied.")


if __name__ == "__main__":
    main()

