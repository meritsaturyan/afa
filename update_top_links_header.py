import pathlib

ROOT = pathlib.Path(__file__).resolve().parent


AM_HEADER = """
<div class="header">
  <div class="page_container">
    <div class="header_main">
      <div class="main_logo">
        <a href="./index.html" aria-label="Home">
          <img src="public/logo.jpg" alt="ՀՖԱ" title="ՀՖԱ">
        </a>
      </div>

      <div class="header_org_name">Հայաստանի Ֆինանսիստների Ասոցիացիա</div>

      <!-- TOP LINKS: всегда сверху -->
      <div class="second_menu">
        <ul class="menu_list">
          <li><a href="mermasin.html">Մեր մասին</a></li>
          <li><a href="andamakcutyan_hayt.html">Անդամակցության հայտ</a></li>
          <li><a href="hetadardk_kap.html">Հետադարձ կապ</a></li>
        </ul>
      </div>

      <!-- ACTIONS справа: поиск + языки + бургер -->
      <div class="header_actions">
        <div class="search_block" data-type="close">
          <form method="GET" action="#">
            <input type="text" name="term" value="" autocomplete="off" placeholder="Որոնել">
            <button type="submit" class="icon_search" aria-label="Search"></button>
          </form>
        </div>

        <div class="lg_block">
          <button class="drop_btn icon_down" id="lang_btn" type="button">am</button>
          <ul class="drop_block" id="lang_dropdown">
            <li><a href="./index.html" class="lang_link">am</a></li>
            <li><a href="./ru/index.html" class="lang_link">ru</a></li>
            <li><a href="./en/index.html" class="lang_link">en</a></li>
          </ul>
        </div>

        <button class="menu_btn" type="button" aria-label="Menu"><span></span></button>
      </div>
    </div>

    <!-- НИЖНИЙ РЯД: только основное меню -->
    <div class="menu_block">
      <div class="menu_inner">
        <ul class="menu_list">
          <li><a href="gorcuneutyun.html">Գործունեություն</a></li>
          <li><a class="submenu_btn" href="inchuandamakcel.html">Անդամակցել</a></li>
          <li><a href="andamner.html">Անդամներ</a></li>
          <li><a class="submenu_btn" href="norutyunner.html">Նորություններ</a></li>
          <li><a href="mijotsaranner.html">Միջոցառումներ</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>
""".strip()


RU_HEADER = """
<div class="header">
  <div class="page_container">
    <div class="header_main">
      <div class="main_logo">
        <a href="./index.html" aria-label="Home">
          <img src="../public/logo.jpg" alt="АФА" title="АФА">
        </a>
      </div>

      <div class="header_org_name">Ассоциация финансистов Армении</div>

      <div class="second_menu">
        <ul class="menu_list">
          <li><a href="mermasin.html">О нас</a></li>
          <li><a href="andamakcutyan_hayt.html">Заявка на членство</a></li>
          <li><a href="hetadardk_kap.html">Контакты</a></li>
        </ul>
      </div>

      <div class="header_actions">
        <div class="search_block" data-type="close">
          <form method="GET" action="#">
            <input type="text" name="term" value="" autocomplete="off" placeholder="Поиск">
            <button type="submit" class="icon_search" aria-label="Search"></button>
          </form>
        </div>

        <div class="lg_block">
          <button class="drop_btn icon_down" id="lang_btn" type="button">ru</button>
          <ul class="drop_block" id="lang_dropdown">
            <li><a href="../index.html" class="lang_link">am</a></li>
            <li><a href="./index.html" class="lang_link">ru</a></li>
            <li><a href="../en/index.html" class="lang_link">en</a></li>
          </ul>
        </div>

        <button class="menu_btn" type="button" aria-label="Menu"><span></span></button>
      </div>
    </div>

    <div class="menu_block">
      <div class="menu_inner">
        <ul class="menu_list">
          <li><a href="gorcuneutyun.html">Деятельность</a></li>
          <li><a href="inchuandamakcel.html">Вступить</a></li>
          <li><a href="andamner.html">Члены</a></li>
          <li><a href="norutyunner.html">Новости</a></li>
          <li><a href="mijotsaranner.html">Мероприятия</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>
""".strip()


EN_HEADER = """
<div class="header">
  <div class="page_container">
    <div class="header_main">
      <div class="main_logo">
        <a href="./index.html" aria-label="Home">
          <img src="../public/logo.jpg" alt="AFA" title="AFA">
        </a>
      </div>

      <div class="header_org_name">Association of Financiers of Armenia</div>

      <div class="second_menu">
        <ul class="menu_list">
          <li><a href="mermasin.html">About</a></li>
          <li><a href="andamakcutyan_hayt.html">Membership</a></li>
          <li><a href="hetadardk_kap.html">Contacts</a></li>
        </ul>
      </div>

      <div class="header_actions">
        <div class="search_block" data-type="close">
          <form method="GET" action="#">
            <input type="text" name="term" value="" autocomplete="off" placeholder="Search">
            <button type="submit" class="icon_search" aria-label="Search"></button>
          </form>
        </div>

        <div class="lg_block">
          <button class="drop_btn icon_down" id="lang_btn" type="button">en</button>
          <ul class="drop_block" id="lang_dropdown">
            <li><a href="../index.html" class="lang_link">am</a></li>
            <li><a href="../ru/index.html" class="lang_link">ru</a></li>
            <li><a href="./index.html" class="lang_link">en</a></li>
          </ul>
        </div>

        <button class="menu_btn" type="button" aria-label="Menu"><span></span></button>
      </div>
    </div>

    <div class="menu_block">
      <div class="menu_inner">
        <ul class="menu_list">
          <li><a href="gorcuneutyun.html">Activities</a></li>
          <li><a href="inchuandamakcel.html">Join</a></li>
          <li><a href="andamner.html">Members</a></li>
          <li><a href="norutyunner.html">News</a></li>
          <li><a href="mijotsaranner.html">Events</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>
""".strip()


CSS_PATCH = """
/* ===== FORCE second_menu to stay in top header row (desktop) ===== */
@media screen and (min-width: 960px) {
  .header_main {
    display: flex !important;
    align-items: center !important;
    height: 85px !important;
  }

  /* название слева/по центру, а second_menu + actions справа */
  .header_org_name {
    margin-right: auto !important;
  }

  .second_menu {
    display: flex !important;
    align-items: center !important;
    margin-left: auto !important;
    height: 50px !important;
  }

  .second_menu .menu_list {
    display: flex !important;
    align-items: center !important;
    gap: 26px !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .second_menu .menu_list > li {
    padding: 0 !important;
    margin: 0 !important;
  }

  .second_menu .menu_list > li > a {
    font-family: GAAGayane-Regular, montserrat, montserratarm !important;
    font-weight: 500 !important;
    font-size: 16px !important; /* чуть больше */
    line-height: 20px !important;
    white-space: nowrap !important;
  }
}

/* ===== REMOVE wrong mobile duplicates (only if they exist) ===== */
@media screen and (max-width: 959px) {
  .mobile_only {
    display: none !important;
  }
}
""".strip()


def read_text(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: pathlib.Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def replace_header(content: str, new_header: str) -> str:
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
            i += 1
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


def ensure_css(content: str) -> str:
    if "FORCE second_menu to stay in top header row" in content:
        return content
    style_end = content.find("</style>")
    if style_end == -1:
        return content
    before = content[:style_end]
    after = content[style_end:]
    return before.rstrip() + "\n\n" + CSS_PATCH + "\n" + after


def process_file(path: pathlib.Path, header_variant: str) -> bool:
    content = read_text(path)
    original = content

    content = replace_header(content, header_variant)
    content = ensure_css(content)

    if content != original:
        write_text(path, content)
        return True
    return False


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

    changed = []

    for rel in root_files:
        path = ROOT / rel
        if path.exists() and process_file(path, AM_HEADER):
            changed.append(rel)

    for rel in ru_files:
        path = ROOT / rel
        if path.exists() and process_file(path, RU_HEADER):
            changed.append(rel)

    for rel in en_files:
        path = ROOT / rel
        if path.exists() and process_file(path, EN_HEADER):
            changed.append(rel)

    if changed:
        print("Updated top-links header in:")
        for f in changed:
            print(f)
    else:
        print("No changes applied.")


if __name__ == "__main__":
    main()

