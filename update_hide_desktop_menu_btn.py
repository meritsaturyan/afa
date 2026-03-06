import pathlib

ROOT = pathlib.Path(__file__).resolve().parent

CSS_SNIPPET = """
/* FIX: квадрат справа — это .menu_btn. На desktop прячем. */
@media screen and (min-width: 960px) {
  .header .menu_btn {
    display: none !important;
  }
}

/* На всякий случай: убрать квадратный вид даже если где-то покажется */
.header .menu_btn {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}
""".strip()


def read_text(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: pathlib.Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def ensure_css(content: str) -> str:
    if "FIX: квадрат справа — это .menu_btn" in content:
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
        print("Added menu_btn desktop hide CSS to:")
        for f in changed:
            print(f)
    else:
        print("No changes applied.")


if __name__ == "__main__":
    main()

