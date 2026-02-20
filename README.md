# AFA — Ассоциация финансистов Армении

Многоязычный сайт Ассоциации финансистов Армении (ՀՖԱ).  
Поддерживаются три языка: **армянский** (am), **русский** (ru), **английский** (en).

## Структура проекта

```
afa/
├── index.html              # Главная (армянский)
├── *.html                  # Страницы на армянском (корень)
├── ru/                     # Русская версия
│   ├── index.html
│   └── *.html
├── en/                     # Английская версия
│   ├── index.html
│   └── *.html
├── public/                 # Изображения, логотип
├── fonts/                  # Шрифты (если есть)
├── *.css, *.js             # Стили и скрипты
└── translate_pages.py     # Скрипт пакетного перевода страниц
```

## Языки и навигация

- **am** — армянский (корневые страницы)
- **ru** — русский (папка `ru/`)
- **en** — английский (папка `en/`)

Переключатель языка в шапке сайта доступен на всех страницах; при смене языка открывается та же страница на выбранном языке.

## Как открыть сайт локально

1. Клонировать репозиторий:
   ```bash
   git clone https://github.com/YOUR_USERNAME/afa.git
   cd afa
   ```

2. Запустить любой локальный сервер из корня проекта, например:
   ```bash
   python3 -m http.server 8000
   ```
   или с помощью расширения Live Server в VS Code.

3. Открыть в браузере: `http://localhost:8000` (или указанный порт).

Страницы — статические HTML, отдельный бэкенд не нужен.

## Страницы

| Файл | Описание (ru) |
|------|----------------|
| index.html | Главная |
| mermasin.html | О нас |
| gorcuneutyun.html | Деятельность |
| inchuandamakcel.html | Почему вступить |
| tsarayutyunner.html | Услуги |
| andamner.html | Члены |
| andamakcutyan_hayt.html | Заявка на членство |
| norutyunner.html | Новости |
| mijotsaranner.html | Мероприятия |
| khorhurd.html | Совет АФА |
| gorcakir.html | Исполнительный орган |
| gorcynkerner.html | Партнёры |
| ashxatatexer.html | Вакансии |
| hetadardk_kap.html | Обратная связь |

## Вспомогательные скрипты

- **translate_pages.py** — пакетный перевод/синхронизация текста в `ru/*.html` и `en/*.html` (запуск: `python3 translate_pages.py`).
- **add_lang_dropdown_script.py** — добавление скрипта переключателя языка перед `</body>` во все HTML-файлы с `id="lang_dropdown"`.

## Публикация на GitHub

Если репозиторий ещё не привязан к GitHub:

1. Создайте новый репозиторий на [GitHub](https://github.com/new) (без README и .gitignore).
2. Выполните в корне проекта:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/afa.git
   git branch -M main
   git add .
   git commit -m "Initial commit: AFA multilingual site"
   git push -u origin main
   ```

Замените `YOUR_USERNAME` на ваш логин GitHub.

## Лицензия

По желанию укажите лицензию (MIT, CC и т.д.).
