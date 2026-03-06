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

    <div class="menu_block">
      <div class="menu_inner">
        <!-- Mobile-only top links -->
        <ul class="menu_list">
          <li class="mobile_only"><a href="mermasin.html">Մեր մասին</a></li>
          <li class="mobile_only"><a href="andamakcutyan_hayt.html">Անդամակցության հայտ</a></li>
          <li class="mobile_only"><a href="hetadardk_kap.html">Հետադարձ կապ</a></li>

          <!-- Main row -->
          <li><a href="gorcuneutyun.html">Գործունեություն</a></li>
          <li><a class="submenu_btn" href="inchuandamakcel.html">Անդամակցել</a></li>
          <li><a href="andamner.html">Անդամներ</a></li>
          <li><a class="submenu_btn" href="norutyunner.html">Նորություններ</a></li>
          <li><a href="mijotsaranner.html">Միջոցառումներ</a></li>
        </ul>

        <!-- Desktop top-right links row -->
        <div class="second_menu">
          <ul class="menu_list">
            <li><a href="mermasin.html">Մեր մասին</a></li>
            <li><a href="andamakcutyan_hayt.html">Անդամակցության հայտ</a></li>
            <li><a href="hetadardk_kap.html">Հետադարձ կապ</a></li>
          </ul>
        </div>
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
          <li class="mobile_only"><a href="mermasin.html">О нас</a></li>
          <li class="mobile_only"><a href="andamakcutyan_hayt.html">Заявка на членство</a></li>
          <li class="mobile_only"><a href="hetadardk_kap.html">Контакты</a></li>

          <li><a href="gorcuneutyun.html">Деятельность</a></li>
          <li><a href="inchuandamakcel.html">Вступить</a></li>
          <li><a href="andamner.html">Члены</a></li>
          <li><a href="norutyunner.html">Новости</a></li>
          <li><a href="mijotsaranner.html">Мероприятия</a></li>
        </ul>

        <div class="second_menu">
          <ul class="menu_list">
            <li><a href="mermasin.html">О нас</a></li>
            <li><a href="andamakcutyan_hayt.html">Заявка на членство</a></li>
            <li><a href="hetadardk_kap.html">Контакты</a></li>
          </ul>
        </div>
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
          <li class="mobile_only"><a href="mermasin.html">About</a></li>
          <li class="mobile_only"><a href="andamakcutyan_hayt.html">Membership</a></li>
          <li class="mobile_only"><a href="hetadardk_kap.html">Contacts</a></li>

          <li><a href="gorcuneutyun.html">Activities</a></li>
          <li><a href="inchuandamakcel.html">Join</a></li>
          <li><a href="andamner.html">Members</a></li>
          <li><a href="norutyunner.html">News</a></li>
          <li><a href="mijotsaranner.html">Events</a></li>
        </ul>

        <div class="second_menu">
          <ul class="menu_list">
            <li><a href="mermasin.html">About</a></li>
            <li><a href="andamakcutyan_hayt.html">Membership</a></li>
            <li><a href="hetadardk_kap.html">Contacts</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
""".strip()


CSS_OVERRIDE = """
/* =========================
   HEADER UNIFY + FONT BOOST
   ========================= */

/* 1) Desktop: hide burger (removes weird square) */
@media screen and (min-width: 960px) {
  .header .menu_btn {
    display: none !important;
  }
}

/* 2) Desktop: make top row (second_menu) right-aligned and readable */
@media screen and (min-width: 960px) {
  .header_main {
    align-items: flex-start !important;
  }

  .header .second_menu {
    display: block !important;
  }

  /* Slightly bigger font for top row links */
  .header .second_menu .menu_list > li > a {
    font-size: 18px !important;
    line-height: 22px !important;
    font-weight: 500 !important;
  }
}

/* 3) Desktop: slightly bigger main menu items (bold row) */
@media screen and (min-width: 960px) {
  .header .menu_inner > .menu_list > li > a {
    font-size: 18px !important;
    line-height: 22px !important;
  }
}

/* 4) Mobile: slightly bigger menu items too */
@media screen and (max-width: 959px) {
  .header .menu_block .menu_list > li > a {
    font-size: 18px !important;
    line-height: 22px !important;
  }
}

/* 5) Keep search + lang on the top row (desktop) */
@media screen and (min-width: 960px) {
  .header_main .search_block,
  .header_main .lg_block {
    align-self: flex-start !important;
    margin-top: 10px !important;
  }
}

/* 6) Ensure logo is clickable and doesn’t shift layout */
.header .main_logo a {
  display: block;
}
""".strip()


JS_SNIPPET = """
<script>
  // Language dropdown toggle
  (function () {
    var btn = document.getElementById('lang_btn');
    var dd = document.getElementById('lang_dropdown');
    if (!btn || !dd) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dd.style.display = (dd.style.display === 'block') ? 'none' : 'block';
    });

    document.addEventListener('click', function () {
      dd.style.display = 'none';
    });
  })();

  // Mobile menu toggle (burger)
  (function () {
    var btn = document.querySelector('.header .menu_btn');
    if (!btn) return;

    btn.addEventListener('click', function () {
      document.body.classList.toggle('menu_opened');
    });
  })();
</script>
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
    if "HEADER UNIFY + FONT BOOST" in content:
        return content
    style_end = content.find("</style>")
    if style_end == -1:
        return content
    before = content[:style_end]
    after = content[style_end:]
    return before.rstrip() + "\n\n" + CSS_OVERRIDE + "\n" + after


def ensure_js(content: str) -> str:
    if "Language dropdown toggle" in content and "Mobile menu toggle (burger)" in content:
        return content
    body_close = content.rfind("</body>")
    if body_close == -1:
        return content
    return content[:body_close] + "\n" + JS_SNIPPET + "\n" + content[body_close:]


def process_file(path: pathlib.Path, header_variant: str) -> bool:
    content = read_text(path)
    original = content

    content = replace_header(content, header_variant)
    content = ensure_css(content)
    content = ensure_js(content)

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
        print("Updated canonical headers/CSS/JS in:")
        for f in changed:
            print(f)
    else:
        print("No changes applied.")


if __name__ == "__main__":
    main()

