#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Translate ru/*.html to Russian and en/*.html to English."""

import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))

# Common replacements for RU (Armenian -> Russian) - use str.replace
def apply_ru_common(content):
    content = content.replace('<html lang="am"', '<html lang="ru"')
    content = content.replace('href="public/', 'href="../public/')
    content = content.replace('src="public/', 'src="../public/')
    content = content.replace('url(../fonts/', 'url(../../fonts/')
    content = content.replace('alt="ՀՖԱ" title="ՀՖԱ"', 'alt="АФА" title="АФА"')
    content = content.replace('placeholder="Որոնել"', 'placeholder="Поиск"')
    content = content.replace('>Մեր մասին<', '>О нас<')
    content = content.replace('>ՀՖԱ մասին<', '>Об АФА<')
    content = content.replace('>Գործընկերներ<', '>Партнёры<')
    content = content.replace('>ՀՖԱ Խորհուրդ<', '>Совет АФА<')
    content = content.replace('>ՀՖԱ Գործադիր Մարմին<', '>Исполнительный орган АФА<')
    content = content.replace('>Աշխատատեղեր<', '>Вакансии<')
    content = content.replace('>Անդամակցության հայտ<', '>Заявка на членство<')
    content = content.replace('>Հետադարձ կապ<', '>Обратная связь<')
    content = content.replace('Կոնտակտային տվյալներ', 'Контактные данные')
    content = content.replace('ք. Երևան, 0012, Վաղարշյան 12', 'г. Ереван, 0012, ул. Вагаршяна 12')
    content = content.replace('2026 Բոլոր իրավունքները պաշտպանված են:', '2026 Все права защищены.')
    content = content.replace(' – ՀՖԱ', ' – АФА')
    return content

def apply_en_common(content):
    content = content.replace('<html lang="am"', '<html lang="en"')
    content = content.replace('href="public/', 'href="../public/')
    content = content.replace('src="public/', 'src="../public/')
    content = content.replace('url(../fonts/', 'url(../../fonts/')
    content = content.replace('alt="ՀՖԱ" title="ՀՖԱ"', 'alt="AFA" title="AFA"')
    content = content.replace('placeholder="Որոնել"', 'placeholder="Search"')
    content = content.replace('>Մեր մասին<', '>About us<')
    content = content.replace('>ՀՖԱ մասին<', '>About AFA<')
    content = content.replace('>Գործընկերներ<', '>Partners<')
    content = content.replace('>ՀՖԱ Խորհուրդ<', '>AFA Council<')
    content = content.replace('>ՀՖԱ Գործադիր Մարմին<', '>AFA Executive Body<')
    content = content.replace('>Աշխատատեղեր<', '>Jobs<')
    content = content.replace('>Անդամակցության հայտ<', '>Membership application<')
    content = content.replace('>Հետադարձ կապ<', '>Contact<')
    content = content.replace('Կոնտակտային տվյալներ', 'Contact information')
    content = content.replace('ք. Երևան, 0012, Վաղարշյան 12', 'Yerevan, 0012, 12 Vagharshyan St')
    content = content.replace('2026 Բոլոր իրավունքները պաշտպանված են:', '2026 All rights reserved.')
    content = content.replace(' – ՀՖԱ', ' – AFA')
    return content

# Per-page: (filename) -> { 'ru': [(title, og_title, h1_or_section, content_replacements)], 'en': [...] }
# Content replacements are list of (arm, ru_or_en) for main body text
PAGES = {
    'andamner.html': {
        'ru': [('Անդամներ – ՀՖԱ', 'АФА', 'Անդամներ', [
            (r'<title>Անդամներ – ՀՖԱ</title>', '<title>Члены – АФА</title>'),
            (r'content="Անդամներ"', 'content="Члены"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('Անդամներ – ՀՖԱ', 'AFA', 'Անդամներ', [
            (r'<title>Անդամներ – ՀՖԱ</title>', '<title>Members – AFA</title>'),
            (r'content="Անդամներ"', 'content="Members"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
    'ashxatatexer.html': {
        'ru': [('Աշխատատեղեր – ՀՖԱ', 'АФА', 'Աշխատատեղեր', [
            (r'<title>Աշխատատեղեր – ՀՖԱ</title>', '<title>Вакансии – АФА</title>'),
            (r'content="Աշխատատեղեր"', 'content="Вакансии"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('Աշխատատեղեր – ՀՖԱ', 'AFA', 'Աշխատատեղեր', [
            (r'<title>Աշխատատեղեր – ՀՖԱ</title>', '<title>Jobs – AFA</title>'),
            (r'content="Աշխատատեղեր"', 'content="Jobs"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
    'gorcakir.html': {
        'ru': [('ՀՖԱ Գործադիր Մարմին – ՀՖԱ', 'АФА', 'ՀՖԱ Գործադիր Մարմին', [
            (r'<title>ՀՖԱ Գործադիր Մարմին – ՀՖԱ</title>', '<title>Исполнительный орган АФА – АФА</title>'),
            (r'content="ՀՖԱ Գործադիր Մարմին"', 'content="Исполнительный орган АФА"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('ՀՖԱ Գործադիր Մարմին – ՀՖԱ', 'AFA', 'ՀՖԱ Գործադիր Մարմին', [
            (r'<title>ՀՖԱ Գործադիր Մարմին – ՀՖԱ</title>', '<title>AFA Executive Body – AFA</title>'),
            (r'content="ՀՖԱ Գործադիր Մարմին"', 'content="AFA Executive Body"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
    'gorcuneutyun.html': {
        'ru': [('Գործունեություն – ՀՖԱ', 'АФА', 'Գործունեություն', [
            (r'<title>Գործունեություն – ՀՖԱ</title>', '<title>Деятельность – АФА</title>'),
            (r'content="Գործունեություն"', 'content="Деятельность"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('Գործունեություն – ՀՖԱ', 'AFA', 'Գործունեություն', [
            (r'<title>Գործունեություն – ՀՖԱ</title>', '<title>Activity – AFA</title>'),
            (r'content="Գործունեություն"', 'content="Activity"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
    'gorcynkerner.html': {
        'ru': [('Գործընկերներ – ՀՖԱ', 'АФА', 'Գործընկերներ', [
            (r'<title>Գործընկերներ – ՀՖԱ</title>', '<title>Партнёры – АФА</title>'),
            (r'content="Գործընկերներ"', 'content="Партнёры"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('Գործընկերներ – ՀՖԱ', 'AFA', 'Գործընկերներ', [
            (r'<title>Գործընկերներ – ՀՖԱ</title>', '<title>Partners – AFA</title>'),
            (r'content="Գործընկերներ"', 'content="Partners"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
    'gorcynkerner_new.html': {
        'ru': [('Գործընկերներ – ՀՖԱ', 'АФА', 'Գործընկերներ', [
            (r'<title>Գործընկերներ – ՀՖԱ</title>', '<title>Партнёры – АФА</title>'),
            (r'content="Գործընկերներ"', 'content="Партнёры"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('Գործընկերներ – ՀՖԱ', 'AFA', 'Գործընկերներ', [
            (r'<title>Գործընկերներ – ՀՖԱ</title>', '<title>Partners – AFA</title>'),
            (r'content="Գործընկերներ"', 'content="Partners"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
    'hetadardk_kap.html': {
        'ru': [('Հետադարձ կապ – ՀՖԱ', 'АФА', 'Հետադարձ կապ', [
            (r'<title>Հետադարձ կապ – ՀՖԱ</title>', '<title>Обратная связь – АФА</title>'),
            (r'content="Հետադարձ կապ"', 'content="Обратная связь"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('Հետադարձ կապ – ՀՖԱ', 'AFA', 'Հետադարձ կապ', [
            (r'<title>Հետադարձ կապ – ՀՖԱ</title>', '<title>Contact – AFA</title>'),
            (r'content="Հետադարձ կապ"', 'content="Contact"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
    'inchuandamakcel.html': {
        'ru': [('Ինչու անդամակցել – ՀՖԱ', 'АФА', 'Ինչու անդամակցել', [
            (r'<title>Ինչու անդամակցել – ՀՖԱ</title>', '<title>Почему вступить – АФА</title>'),
            (r'content="Ինչու անդամակցել"', 'content="Почему вступить"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('Ինչու անդամակցել – ՀՖԱ', 'AFA', 'Ինչու անդամակցել', [
            (r'<title>Ինչու անդամակցել – ՀՖԱ</title>', '<title>Why join – AFA</title>'),
            (r'content="Ինչու անդամակցել"', 'content="Why join"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
    'khorhurd.html': {
        'ru': [('ՀՖԱ Խորհուրդ – ՀՖԱ', 'АФА', 'ՀՖԱ Խորհուրդ', [
            (r'<title>ՀՖԱ Խորհուրդ – ՀՖԱ</title>', '<title>Совет АФА – АФА</title>'),
            (r'content="ՀՖԱ Խորհուրդ"', 'content="Совет АФА"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('ՀՖԱ Խորհուրդ – ՀՖԱ', 'AFA', 'ՀՖԱ Խորհուրդ', [
            (r'<title>ՀՖԱ Խորհուրդ – ՀՖԱ</title>', '<title>AFA Council – AFA</title>'),
            (r'content="ՀՖԱ Խորհուրդ"', 'content="AFA Council"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
    'mermasin.html': {
        'ru': [('Մեր մասին – ՀՖԱ', 'АФА', 'Մեր մասին', [
            (r'<title>Մեր մասին – ՀՖԱ</title>', '<title>О нас – АФА</title>'),
            (r'content="Մեր մասին"', 'content="О нас"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('Մեր մասին – ՀՖԱ', 'AFA', 'Մեր մասին', [
            (r'<title>Մեր մասին – ՀՖԱ</title>', '<title>About us – AFA</title>'),
            (r'content="Մեր մասին"', 'content="About us"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
    'mijotsaranner.html': {
        'ru': [('Միջոցառումներ – ՀՖԱ', 'АФА', 'Միջոցառումներ', [
            (r'<title>Միջոցառումներ – ՀՖԱ</title>', '<title>Мероприятия – АФА</title>'),
            (r'content="Միջոցառումներ"', 'content="Мероприятия"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('Միջոցառումներ – ՀՖԱ', 'AFA', 'Միջոցառումներ', [
            (r'<title>Միջոցառումներ – ՀՖԱ</title>', '<title>Events – AFA</title>'),
            (r'content="Միջոցառումներ"', 'content="Events"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
    'norutyunner.html': {
        'ru': [('Նորություններ – ՀՖԱ', 'АФА', 'Նորություններ', [
            (r'<title>Նորություններ – ՀՖԱ</title>', '<title>Новости – АФА</title>'),
            (r'content="Նորություններ"', 'content="Новости"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('Նորություններ – ՀՖԱ', 'AFA', 'Նորություններ', [
            (r'<title>Նորություններ – ՀՖԱ</title>', '<title>News – AFA</title>'),
            (r'content="Նորություններ"', 'content="News"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
    'tsarayutyunner.html': {
        'ru': [('Ծառայություններ – ՀՖԱ', 'АФА', 'Ծառայություններ', [
            (r'<title>Ծառայություններ – ՀՖԱ</title>', '<title>Услуги – АФА</title>'),
            (r'content="Ծառայություններ"', 'content="Услуги"'),
            (r'content="ՀՖԱ"', 'content="АФА"'),
        ])],
        'en': [('Ծառայություններ – ՀՖԱ', 'AFA', 'Ծառայություններ', [
            (r'<title>Ծառայություններ – ՀՖԱ</title>', '<title>Services – AFA</title>'),
            (r'content="Ծառայություններ"', 'content="Services"'),
            (r'content="ՀՖԱ"', 'content="AFA"'),
        ])],
    },
}

# Lang dropdown: for ru/ replace with ../pagename, #, ../en/pagename and btn "ru"
# for en/ replace with ../pagename, ../ru/pagename, # and btn "en"
def fix_lang_dropdown_ru(content, pagename):
    content = re.sub(
        r'<li><a href="#" class="lang_link" data-lang="am">am</a></li>\s*<li><a href="ru/index\.html" class="lang_link" data-lang="ru">ru</a></li>\s*<li><a href="en/index\.html" class="lang_link" data-lang="en">en</a></li>',
        f'<li><a href="../{pagename}" class="lang_link" data-lang="am">am</a></li>\n                    <li><a href="#" class="lang_link" data-lang="ru">ru</a></li>\n                    <li><a href="../en/{pagename}" class="lang_link" data-lang="en">en</a></li>',
        content, count=1
    )
    content = re.sub(r'<button class="drop_btn icon_down" id="lang_btn">am</button>', '<button class="drop_btn icon_down" id="lang_btn">ru</button>', content, count=1)
    return content

def fix_lang_dropdown_en(content, pagename):
    content = re.sub(
        r'<li><a href="#" class="lang_link" data-lang="am">am</a></li>\s*<li><a href="ru/index\.html" class="lang_link" data-lang="ru">ru</a></li>\s*<li><a href="en/index\.html" class="lang_link" data-lang="en">en</a></li>',
        f'<li><a href="../{pagename}" class="lang_link" data-lang="am">am</a></li>\n                    <li><a href="../ru/{pagename}" class="lang_link" data-lang="ru">ru</a></li>\n                    <li><a href="#" class="lang_link" data-lang="en">en</a></li>',
        content, count=1
    )
    content = re.sub(r'<button class="drop_btn icon_down" id="lang_btn">am</button>', '<button class="drop_btn icon_down" id="lang_btn">en</button>', content, count=1)
    return content

def translate_arm_to_ru(content):
    """Replace all Armenian UI strings with Russian (generic)."""
    arm_ru = [
        (r'Մեր մասին', 'О нас'),
        (r'ՀՖԱ մասին', 'Об АФА'),
        (r'Գործընկերներ', 'Партнёры'),
        (r'ՀՖԱ Խորհուրդ', 'Совет АФА'),
        (r'ՀՖԱ Գործադիր Մարմին', 'Исполнительный орган АФА'),
        (r'Աշխատատեղեր', 'Вакансии'),
        (r'Անդամակցության հայտ', 'Заявка на членство'),
        (r'Հետադարձ կապ', 'Обратная связь'),
        (r'Գործունեություն', 'Деятельность'),
        (r'Անդամակցել', 'Вступить'),
        (r'Ինչու անդամակցել', 'Почему вступить'),
        (r'Ծառայություններ', 'Услуги'),
        (r'Անդամներ', 'Члены'),
        (r'Նորություններ', 'Новости'),
        (r'Հայտարարություն', 'Объявления'),
        (r'Հարցազրույցներ', 'Интервью'),
        (r'Միջոցառումներ', 'Мероприятия'),
        (r'Գլխավոր', 'Главная'),
    ]
    for arm, ru in arm_ru:
        content = content.replace(arm, ru)
    return content

def translate_arm_to_en(content):
    arm_en = [
        (r'Մեր մասին', 'About us'),
        (r'ՀՖԱ մասին', 'About AFA'),
        (r'Գործընկերներ', 'Partners'),
        (r'ՀՖԱ Խորհուրդ', 'AFA Council'),
        (r'ՀՖԱ Գործադիր Մարմին', 'AFA Executive Body'),
        (r'Աշխատատեղեր', 'Jobs'),
        (r'Անդամակցության հայտ', 'Membership application'),
        (r'Հետադարձ կապ', 'Contact'),
        (r'Գործունեություն', 'Activity'),
        (r'Անդամակցել', 'Join'),
        (r'Ինչու անդամակցել', 'Why join'),
        (r'Ծառայություններ', 'Services'),
        (r'Անդամներ', 'Members'),
        (r'Նորություններ', 'News'),
        (r'Հայտարարություն', 'Announcements'),
        (r'Հարցազրույցներ', 'Interviews'),
        (r'Միջոցառումներ', 'Events'),
        (r'Գլխավոր', 'Home'),
    ]
    for arm, en in arm_en:
        content = content.replace(arm, en)
    return content

def process_file(folder, pagename, lang):
    path = os.path.join(BASE, folder, pagename)
    if not os.path.isfile(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if lang == 'ru':
        content = apply_ru_common(content)
        content = fix_lang_dropdown_ru(content, pagename)
        content = translate_arm_to_ru(content)
        if pagename in PAGES and 'ru' in PAGES[pagename]:
            for pat, repl in PAGES[pagename]['ru'][0][3]:
                content = content.replace(pat, repl, 1)
    else:
        content = apply_en_common(content)
        content = fix_lang_dropdown_en(content, pagename)
        content = translate_arm_to_en(content)
        if pagename in PAGES and 'en' in PAGES[pagename]:
            for pat, repl in PAGES[pagename]['en'][0][3]:
                content = content.replace(pat, repl, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Done {folder}/{pagename}')

def main():
    pages = list(PAGES.keys())
    for p in pages:
        process_file('ru', p, 'ru')
        process_file('en', p, 'en')

if __name__ == '__main__':
    main()
