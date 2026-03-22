# Career opportunities (mediator job board) — backend notes

Frontend: `jobs-board.js` + `ashxatatexer.html` (hy / `en/` / `ru/`).

Set `window.JOBS_API_BASE = 'https://your-api.example.com'` before loading `jobs-board.js` when the API is live.

## `GET /jobs`

Query: `category`, `experience`, `employment_type`, `search` (optional).

Response JSON (example):

```json
{
  "jobs": [
    {
      "id": "uuid",
      "title": "…",
      "category": "finance",
      "experience": "mid",
      "employment_type": "hybrid",
      "description": "…",
      "salary_range": "…",
      "created_at": "2026-03-01"
    }
  ]
}
```

**Do not** include `company_name` or company contact fields in the payload used by this page.

Multilingual: you may return `title` / `description` / `salary_range` as objects `{ "am": "…", "en": "…", "ru": "…" }` or as a single string.

## `POST /jobs/:id/apply`

`multipart/form-data`:

- `first_name` (required)  
- `last_name` (required)  
- `phone` (required, `+374…`)  
- `email` (required)  
- `cv_file` (required, pdf/doc/docx)  
- `message` (optional)

## Admin (out of scope for static HTML)

Per product spec: CRUD jobs, list applications, export/forward to companies — implement in your admin app / CMS.
