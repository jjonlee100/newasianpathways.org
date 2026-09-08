# New Asian Pathways

Static website for [New Asian Pathways](https://newasianpathways.org/), a 501(c)(3) nonprofit (EIN 93-4138449) supporting the persecuted church in Asia.

**Hero:** Support the Persecuted Church in Asia to reach the World

**Donate:** [Tithely give form](https://give.tithe.ly/?formId=4e3604e2-ff67-4aeb-99ef-311428aea7fa)

## Site structure

| File | Description |
|------|-------------|
| `index.html` | Home — hero, mission, distinctives overview, budget summary, funding cards, contact |
| `about.html` | Full mission + ministry distinctives |
| `mk-education-support.html` | MK Education Support ($200k) |
| `training-center-support.html` | Training Center Support ($150k) |
| `digital-training-support.html` | Digital Training Support ($145k) |
| `family-camps.html` | Family / Children / Youth Camps ($200k) |
| `conferences.html` | Conferences & Retreats ($240k) |
| `agency-support.html` | Agency Support ($250k) |
| `micro-business.html` | Micro-Business for Church Planters ($180k) |
| `CNAME` | Custom domain: `newasianpathways.org` |
| `assets/` | CSS, JS, and locally hosted images |

Plain HTML + shared CSS (+ minimal nav JS). No build step.

## GitHub Pages setup

This repo is configured for **GitHub Pages** from the **`main`** branch, **`/` (root)**.

1. In the repo: **Settings → Pages**.
2. Source: **Deploy from a branch**.
3. Branch: **`main`** / folder: **`/` (root)**.
4. Custom domain: **`newasianpathways.org`** (the `CNAME` file in the repo root already contains this hostname).
5. After DNS propagates, enable **Enforce HTTPS** in Pages settings.

Public URLs once live:

- GitHub Pages default: `https://jjonlee100.github.io/newasianpathways.org/`
- Custom domain: `https://newasianpathways.org/` (and typically `https://www.newasianpathways.org/` if you add the www records below)

## GoDaddy DNS (apex + www → GitHub Pages)

In GoDaddy DNS for `newasianpathways.org`, set (or replace conflicting A/CNAME/forwarding rules):

### Apex (root) — `newasianpathways.org`

GitHub Pages apex uses **A** records pointing to GitHub’s IPs:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | `185.199.108.153` | 600 (or default) |
| A | `@` | `185.199.109.153` | 600 |
| A | `@` | `185.199.110.153` | 600 |
| A | `@` | `185.199.111.153` | 600 |

Optional IPv6 (AAAA) if you use them:

| Type | Name | Value |
|------|------|-------|
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

### www — `www.newasianpathways.org`

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | `www` | `jjonlee100.github.io` | 600 |

### Important GoDaddy notes

- Remove or disable **Domain Forwarding** / parked-page redirects that point elsewhere, or they will override Pages.
- Remove old A/CNAME records that pointed at GoDaddy Website Builder or other hosts for `@` and `www`.
- Do **not** put a CNAME on `@` at GoDaddy for the apex (use the A records above).
- After DNS updates, wait for propagation, then confirm the custom domain in GitHub Pages and turn on **Enforce HTTPS**.

Official reference: [GitHub Pages — Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Local preview

Open any HTML file in a browser, or from this directory:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Contact

The previous GoDaddy site did not publish a public contact email. The home page Contact section notes that a Formspree (or similar) backend can be added later. Giving is available via Tithely.
