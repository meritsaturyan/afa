import pathlib

ROOT = pathlib.Path(__file__).resolve().parent

CSS_SNIPPET = """
/* Slightly lower logo on desktop only (v2) */
@media screen and (min-width: 960px) {
  .header .main_logo {
    margin-top: 6px !important;
  }
}
""".strip()


def read_text(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: pathlib.Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def ensure_css(content: str) -> str:
    if "Slightly lower logo on desktop only (v2)" in content:
        return content
    style_end = content.find("</style>")
    if style_end == -1:
        return content
    before = content[:style_end]
    after = content[style_end:]
    return before.rstrip() + "\n\n" + CSS_SNIPPET + "\n" + after


def main():
    root_files = [
        "inchuandamakcel.html",
        "tsarayutyunner.html",
        "andamner.html",
        "norutyunner.html",
        "mijotsaranner.html",
        "mermasin.html",
        "gorcynkerner.html",
        "khorhurd.html",
        "gorcakir.html",
        "gorcuneutyun.html",
        "ashxatatexer.html",
        "andamakcutyan_hayt.html",
        "hetadardk_kap.html",
        "index.html",
    ]

    ru_files = [
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
    ]

    en_files = [
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

    all_files = root_files + ru_files + en_files

    changed = []
    for rel in all_files:
        path = ROOT / rel
        if not path.exists():
            continue
        original = read_text(path)
        updated = ensure_css(original)
        if updated != original:
            write_text(path, updated)
            changed.append(rel)

    if changed:
        print("Added desktop logo offset CSS v2 to:")
        for f in changed:
            print(f)
    else:
        print("No changes applied.")


if __name__ == "__main__":
    main()

