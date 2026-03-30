# Админка и backend для сайта AFA

## Что сделано

- **Backend** (`server/`): Node.js + Express, сессии, загрузка файлов, JSON-хранилище `server/data/site.json`.
- **Админка** (`admin/`): вход по паролю, вкладки «Главная», «Новости», «Медиа», «JSON».
- **Сайт**: `cms-loader.js` подтягивает с API hero, блок «О нас», заголовки секции новостей, сетку новостей (3 карточки), блок преимуществ членства и статистику.

Подключено на **`index.html`**, **`en/index.html`**, **`ru/index.html`**.

## Запуск

```bash
cd server
npm install
ADMIN_PASSWORD=ваш_секретный_пароль npm start
```

По умолчанию порт **3847** (переменная `CMS_PORT`). Пароль по умолчанию **`changeme`** (обязательно смените).

- Админка: http://localhost:3847/admin/
- API (публично): `GET http://localhost:3847/api/public/home?lang=am|en|ru`

## Главная страница и Live Server

Сайт часто открывают через Live Server на порту **5500**, а CMS — на **3847**. В `index.html` задано:

`window.CMS_ORIGIN = "http://localhost:3847";`

В **продакшене** поставьте один домен и прокси (например nginx):

- `location /api/ { proxy_pass http://127.0.0.1:3847; }`
- `location /uploads/ { proxy_pass http://127.0.0.1:3847; }`
- `location /admin/ { proxy_pass http://127.0.0.1:3847; }`

И на фронте: `window.CMS_ORIGIN = "";` (пустая строка = тот же origin).

## Файлы данных

| Путь | Назначение |
|------|------------|
| `server/data/site.json` | Весь контент (создаётся при первом запросе) |
| `server/data/password.hash` | Хеш пароля админки (создаётся при первом входе) |
| `server/uploads/` | Загруженные из админки файлы |

`server/data/password.hash` и `server/uploads/` в `.gitignore`.

## Расширение

Остальные страницы (отдельные HTML новостей и т.д.) по-прежнему статические. Чтобы редактировать их из админки, нужны либо отдельные API + мини-скрипты на страницах, либо переход на шаблонизатор / SSG.

## Безопасность

- Смените `ADMIN_PASSWORD` и `SESSION_SECRET`.
- В продакшене включите HTTPS и при необходимости `COOKIE_SECURE=1`.
- Ограничьте доступ к `/admin` по IP или VPN.
