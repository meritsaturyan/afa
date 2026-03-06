import pathlib

ROOT = pathlib.Path(__file__).resolve().parent

CSS_SNIPPET = """
/* =========================
   DESKTOP HEADER: вернуть старую раскладку (search + lang + burger сверху)
   и top links (About/Apply/Contacts) сверху справа
   ========================= */
@media screen and (min-width: 960px) {
  /* header_main как 3 колонки: logo | title | right */
  .header_main {
    display: grid !important;
    grid-template-columns: 140px 1fr auto !important;
    grid-template-areas: "logo title right" !important;
    align-items: center !important;
    height: 85px !important;
    min-height: 85px !important;
  }

  .header .main_logo {
    grid-area: logo !important;
    align-self: center !important;
    margin: 0 !important;
    padding-right: 10px !important;
  }

  .header_org_name {
    grid-area: title !important;
    align-self: center !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* right column: top links + actions */
  .header_actions {
    grid-area: right !important;
    display: flex !important;
    align-items: flex-end !important;
    gap: 14px !important;
  }

  /* вернуть second_menu наверх (Мер о нас/заявка/контакты) */
  .header_main .second_menu {
    display: flex !important;
    align-items: center !important;
    height: auto !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .header_main .second_menu .menu_list {
    display: flex !important;
    align-items: center !important;
    gap: 26px !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .header_main .second_menu .menu_list > li {
    padding: 0 !important;
    margin: 0 !important;
  }

  .header_main .second_menu .menu_list > li > a {
    font-size: 16px !important;
    line-height: 1.2 !important;
    white-space: nowrap !important;
  }

  /* actions справа: 🔍 + lang + burger */
  .header_main .search_block,
  .header_main .lg_block,
  .header_main .menu_btn {
    align-self: center !important;
    margin: 0 !important;
    height: auto !important;
  }

  .header .search_block {
    width: auto !important;
  }

  .header .search_block form {
    height: 44px !important;
  }

  .header .search_block button[type=submit] {
    margin-top: 0 !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
  }

  /* бургер на desktop можно оставить (если ты хочешь) */
  .header .menu_btn {
    display: inline-flex !important;
    width: 44px !important;
    height: 44px !important;
    align-items: center !important;
    justify-content: center !important;
  }
}
""".strip()


def read_text(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: pathlib.Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def ensure_css(content: str) -> str:
    # Не дублировать блок, если он уже вставлен
    if "DESKTOP HEADER: вернуть старую раскладку" in content:
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
        print("Added desktop header layout CSS to:")
        for f in changed:
            print(f)
    else:
        print("No changes applied.")


if __name__ == "__main__":
    main()

