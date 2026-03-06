import pathlib

ROOT = pathlib.Path(__file__).resolve().parent

SCRIPT_SNIPPET = """
<script>
  (function () {
    const path = (location.pathname || "").toLowerCase();
    const isRU = path.includes("/ru/");
    const isEN = path.includes("/en/");
    if (!isRU && !isEN) return; // root (am) не трогаем

    const dict = isRU
      ? {
          "Մեր մասին": "О нас",
          "Անդամակցության հայտ": "Заявка на членство",
          "Հետադարձ կապ": "Контакты",
          "Գործունեություն": "Деятельность",
          "Անդամակցել": "Вступить",
          "Անդամներ": "Члены",
          "Նորություններ": "Новости",
          "Միջոցառումներ": "Мероприятия",
        }
      : {
          "Մեր մասին": "About Us",
          "Անդամակցության հայտ": "Membership Application",
          "Հետադարձ կապ": "Contact",
          "Գործունեություն": "Activities",
          "Անդամակցել": "Join",
          "Անդամներ": "Members",
          "Նորություններ": "News",
          "Միջոցառումներ": "Events",
        };

    // Меняем текст в меню (menu_list и second_menu), только у ссылок
    const menuLinks = document.querySelectorAll(
      ".header .menu_list a, .header .second_menu .menu_list a"
    );

    menuLinks.forEach((a) => {
      const t = (a.textContent || "").replace(/\\s+/g, " ").trim();
      if (dict[t]) a.textContent = dict[t];
    });
  })();
</script>
""".strip()


def read_text(path: pathlib.Path) -> str:
  return path.read_text(encoding="utf-8")


def write_text(path: pathlib.Path, content: str) -> None:
  path.write_text(content, encoding="utf-8")


def ensure_script(content: str) -> str:
  # Не дублируем, если уже вставлено
  marker = 'const path = (location.pathname || "").toLowerCase();'
  if marker in content:
    return content

  body_close = content.rfind("</body>")
  if body_close == -1:
    return content
  return content[:body_close] + "\n" + SCRIPT_SNIPPET + "\n" + content[body_close:]


def main():
  html_files = [
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
    original = read_text(path)
    updated = ensure_script(original)
    if updated != original:
      write_text(path, updated)
      changed.append(rel)

  if changed:
    print("Injected menu localization script into:")
    for f in changed:
      print(f)
  else:
    print("No changes applied.")


if __name__ == "__main__":
  main()

