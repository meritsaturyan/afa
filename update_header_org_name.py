import pathlib

ROOT = pathlib.Path(__file__).resolve().parent


def read_text(path: pathlib.Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: pathlib.Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


def replace_header_org_name(content: str, new_block: str) -> str:
    marker = '<div class="header_org_name">'
    start = content.find(marker)
    if start == -1:
        return content
    # find closing </div> that corresponds to this block
    i = start + len(marker)
    depth = 1  # we are inside header_org_name div
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
    # replace whole block
    return content[:start] + new_block + content[end:]


def process_file(path: pathlib.Path) -> bool:
    rel = str(path)
    if "/en/" in rel:
        new_block = '<div class="header_org_name">\n  Armenian Financiers Association\n</div>'
    elif "/ru/" in rel:
        new_block = '<div class="header_org_name">\n  Ассоциация финансистов Армении\n</div>'
    else:
        return False

    original = read_text(path)
    updated = replace_header_org_name(original, new_block)
    if updated != original:
        write_text(path, updated)
        return True
    return False


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
        if process_file(path):
            changed.append(rel)

    if changed:
        print("Updated header_org_name in:")
        for f in changed:
            print(f)
    else:
        print("No changes applied.")


if __name__ == "__main__":
    main()

