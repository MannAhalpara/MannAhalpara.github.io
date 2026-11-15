# Mann Ahalpara — Portfolio

The concept is **long-term memory**. The site behaves like a calm, precise memory
system: sections are indexed entries (`MEM_01 / INDEX`), and the hero is a field of
dithered points that link into a retrieval graph under the cursor. There's a client-side
BM25 "Ask my memory" terminal too.

Built with Next.js 16 (App Router, static), TypeScript (strict), Tailwind CSS v4, GSAP 3
(ScrollTrigger, SplitText, Flip) and Lenis. No API keys, analytics or paid services.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build (all routes are static)
pnpm start        # serve the production build
pnpm lint         # ESLint (next/core-web-vitals + typescript)
pnpm typecheck    # tsc --noEmit
pnpm format       # Prettier (+ Tailwind class sorting)
```

## Edit content

**All copy and data live in [`src/content/content.ts`](src/content/content.ts).**
Components only render it. Search the repo for `TODO:` to find what still needs to be supplied.

| You want to…                     | Edit                                                    |
| -------------------------------- | ------------------------------------------------------- |
| Change bio, manifesto, pillars   | `positioning` in `content.ts`                           |
| Add / reorder projects           | `projects` (order = display order)                      |
| Add a project year or role       | `year` / `role` on the project (`null` hides the field) |
| Change stats in the bento        | `stats`                                                 |
| Update experience, skills, links | `experience`, `skills`, `identity`                      |
| Replace the résumé               | overwrite `public/resume/Mann_Ahalpara_Research.pdf`    |

**Project images.** Each project has a generated, abstract, dithered placeholder at
`public/work/<slug>/preview.png`. They're made by `pnpm previews`
(`scripts/gen-previews.mjs`) and are deliberately not fake screenshots. Drop real
screenshots into `public/work/<slug>/` and point `ProjectCard` / the case-study page at
them.

The **"Ask my memory"** index is built automatically from `content.ts`
(`src/lib/memory-index.ts`), so new content becomes searchable with no extra step.

## Structure

```
src/
  app/                 layout, home, /work/[slug], 404, OG image, sitemap, robots
  content/content.ts   single source of truth
  components/          Nav, Footer, Preloader, Cursor, hero/, sections/, work/
  motion/              gsap.ts (lazy loader + queue), RevealText, ScrubWords, CountUp,
                       DrawSVG, Magnetic, Marquee, ParallaxImage
  lib/                 memory-index (BM25), scroll (Lenis handle), fonts, hooks
public/resume/         the downloadable PDF
public/work/<slug>/    preview.png + slot for real screenshots
```

### Motion and performance notes

- The **hero text is server-rendered HTML**. Its reveal, the preloader exit, the page
  curtain and the mobile menu are CSS, so nothing above the fold waits on JavaScript.
- **GSAP is loaded lazily**, once the intro finishes or on the first user input. Each
  animation is then set up from a time-sliced queue (`useMotion` in
  `src/motion/gsap.ts`), so hydration never becomes one long task.
- `prefers-reduced-motion: reduce` turns off the preloader, smooth scroll, grain, the
  cursor and every animation, and content shows immediately. With JavaScript disabled
  the site is fully readable.
- Page transitions use React's `<ViewTransition>` (View Transitions API), with a
  curtain fallback in other browsers.

## Deploy (GitHub Pages)

The site is a static export (`output: "export"` in `next.config.ts`): `pnpm build`
writes plain HTML/CSS/JS to `out/`. Every push to `main` runs
`.github/workflows/deploy.yml`, which builds it and publishes `out/` to GitHub Pages
at **mannahalpara.me** (`public/CNAME`).

One-time setup: repo **Settings → Pages → Source: GitHub Actions**, and keep the
custom domain `mannahalpara.me` with HTTPS enforced.

Preview the production build locally:

```bash
pnpm build && npx serve out
```
