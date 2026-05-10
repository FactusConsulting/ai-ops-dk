# ai-ops.dk

Marketing-site for AI-Ops konsulent-virksomhed. Bygget med [Astro](https://astro.build) + [Tailwind CSS v4](https://tailwindcss.com), hostet statisk på Cloudflare Pages.

## Kom i gang lokalt

```sh
npm install
npm run dev   # starter dev-server på http://localhost:4321
```

| Kommando | Handling |
| :-- | :-- |
| `npm run dev` | Lokal dev-server med hot reload |
| `npm run build` | Producer statisk site i `./dist/` |
| `npm run preview` | Preview af produktions-build lokalt |

## Hvor du redigerer hvad

| Vil du rette… | Find filen her |
| :-- | :-- |
| Navn, email, telefon, LinkedIn, navigation | `src/config/site.ts` |
| Hero-tekst (forsidens topafsnit) | `src/components/Hero.astro` |
| Ydelses-kort (de 6 services) | `src/components/Services.astro` |
| "Om mig" tekst og facts | `src/components/About.astro` |
| Kontakt-sektion | `src/components/Contact.astro` |
| Header-logo og navigation | `src/components/Header.astro` |
| Footer | `src/components/Footer.astro` |
| Globale farver, fonts, knap-stil | `src/styles/global.css` |
| Cases (én markdown-fil pr. case) | `src/content/cases/*.md` |
| Blog-artikler (én markdown-fil pr. post) | `src/content/blog/*.md` |
| Logo / favicon | `public/favicon.svg` |

### Tilføj en ny case

Opret en fil i `src/content/cases/min-nye-case.md`:

```markdown
---
title: "Titel på casen"
summary: "Kort opsummering der vises i listen og preview."
industry: "Branche"
duration: "3 måneder"
date: 2026-05-01
technologies:
  - "Teknologi 1"
  - "Teknologi 2"
outcomes:
  - value: "73%"
    label: "kortere svartid"
  - value: "ROI < 6 mdr"
    label: "tilbagebetaling"
---

## Udgangspunktet
…tekst i markdown…
```

Filnavnet bliver URL'en (`/cases/min-nye-case`).

### Tilføj en ny blog-artikel

Opret en fil i `src/content/blog/min-artikel.md`:

```markdown
---
title: "Titel"
description: "Kort beskrivelse til SEO og preview."
date: 2026-05-10
tags: ["AI", "Strategi"]
readingTime: "5 min"
---

…artiklen i markdown…
```

Sæt `draft: true` i frontmatter mens du arbejder — så vises den ikke offentligt.

### Skift profil-billede

Lige nu vises et placeholder-monogram i `src/components/About.astro`. Læg dit billede i `public/profil.jpg` og udskift `<div>`-blokken med:

```astro
<img src="/profil.jpg" alt="Lars W. Andersen" class="w-full h-full object-cover" />
```

## Deploy til Cloudflare Pages

Domænet `ai-ops.dk` er allerede registreret hos Cloudflare. Gør følgende én gang for at koble repo til Pages:

1. **Push repoet til GitHub** (eller GitLab/Bitbucket).
2. På [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Vælg dit repo og opsæt build-indstillinger:
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** `20` (eller højere — sæt env var `NODE_VERSION=20`)
4. Klik **Save and Deploy**.
5. Når det første deploy er kørt: **Custom domains** → **Set up a custom domain** → `ai-ops.dk` (og evt. `www.ai-ops.dk`). Cloudflare opsætter DNS automatisk siden domænet allerede ligger der.

Hver gang du pusher til `main`, deployer Cloudflare automatisk. Pull requests får et preview-URL.

## Stack-detaljer

- **Astro 5** — statisk SSG, zero-JS by default
- **Tailwind CSS v4** — CSS-baseret config via `@theme` direktiv i `global.css`
- **Inter** — variabel font loadet fra rsms.me
- **Markdown content collections** — type-sikre via `src/content.config.ts`
- **@astrojs/sitemap** — auto-genereret `sitemap-index.xml`
