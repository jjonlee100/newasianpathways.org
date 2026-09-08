# New Asian Pathways

Static website for [New Asian Pathways](https://jjonlee100.github.io/newasianpathways.org/), a 501(c)(3) nonprofit (EIN 93-4138449) equipping indigenous leaders to sustain the local church in restricted regions of Asia.

**Positioning:** Equipping indigenous leaders to sustain the local church in restricted regions

**Donate:** [Tithely give form](https://give.tithe.ly/?formId=4e3604e2-ff67-4aeb-99ef-311428aea7fa)

## Site structure

| Path | Description |
|------|-------------|
| `index.html` / `about.html` | English Home + About (primary) |
| `*-support.html`, `family-camps.html`, `conferences.html`, `micro-business.html` | English program pages (story + budget) |
| `ko/` | Korean Home, About, and short program summaries |
| `zh/` | Simplified Chinese Home, About, and short program summaries |
| `assets/` | Shared CSS, JS, images |
| `source/` | Source messaging (e.g. About PDF) |

Plain HTML + shared CSS + minimal nav/language JS. No build step.

## Languages

- Default English at repo root
- `ko/` and `zh/` mirrors for Home + About (full plain-language translations) and program short summaries linking to English for full detail
- Header language switcher (EN / 한국어 / 中文) with `localStorage` preference (`nap-lang`)

## GitHub Pages

Deploy from **`main`** / **`/` (root)**.

Preview: `https://jjonlee100.github.io/newasianpathways.org/`

Custom domain (`newasianpathways.org`) is temporarily cleared for github.io preview — do not re-add a `CNAME` file until ready.

## Local preview

```bash
python3 -m http.server 8080
```

Visit `http://localhost:8080`.
