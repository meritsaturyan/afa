import pathlib

ROOT = pathlib.Path(__file__).resolve().parent

CSS_SNIPPET = """
/* ===== Bigger font for 5 main menu items (am/ru/en) ===== */
.header .menu_list > li > a[href*="gorcuneutyun"],
.header .menu_list > li > a[href*="inchuandamakcel"],
.header .menu_list > li > a[href*="andamner"],
.header .menu_list > li > a[href*="norutyunner"],
.header .menu_list > li > a[href*="mijotsaranner"]{
  font-size: 18px !important;
  line-height: 1.25 !important;
}

@media screen and (max-width: 959px) {
  .header .menu_list > li > a[href*="gorcuneutyun"],
  .header .menu_list > li > a[href*="inchuandamakcel"],
  .header .menu_list > li > a[href*="andamner"],
  .header .menu_list > li > a[href*="norutyunner"],
  .header .menu_list > li > a[href*="mijotsaranner"]{
    font-size: 19px !important;
    line-height: 1.3 !important;
  }
}
""".strip()


def read_text(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: pathlib.Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def ensure_css(content: str) -> str:
    # Не дублируем, если уже поставили px-версию
    if "font-size: 18px !important;" in content:
        return content
    style_end = content.find("</style>")
    if style_end == -1:
        return content
    before = content[:style_end]
    after = content[style_end:]
    return before.rstrip() + "\n\n" + CSS_SNIPPET + "\n" + after


def main():
    html_files = [
        # root
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
        # ru
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
        # en
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
        original = read_text(path)
        updated = ensure_css(original)
        if updated != original:
            write_text(path, updated)
            changed.append(rel)

    if changed:
        print("Added 5-item menu font-size PX CSS to:")
        for f in changed:
            print(f)
    else:
        print("No changes applied.")


if __name__ == "__main__":
    main()

