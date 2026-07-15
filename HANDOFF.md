# CHILL FACTORY — Website Project Handoff

**Snapshot taken: 2026-07-15 01:54:22 PDT**

_Copy this into a new chat for full context. (Note: a persistent project memory also auto-loads in new chats started inside this folder.)_

---

## What it is
Portfolio + marketing site for **Chill Factory**, the documentary production company of director **Christopher Stoudt** (New Orleans native, LA-based). Aesthetic: **minimal, monochrome, bold type, video-forward**, inspired by maxwitting.com.

## Where it lives / stack
- **Folder:** `/Users/christopherstoudt/Documents/WEBSITE`
- **Stack:** Hand-coded **static HTML/CSS/JS**, no build step, no dependencies. Content lives in JSON files, edited (eventually) through a free no-code CMS.
- **Not deployed yet.** Runs locally via `python3 -m http.server`.

## File structure
- `index.html` — landing (full-screen video splash + wordmark + tagline + WORK button)
- `work.html` — the work grid
- `project.html` — single film page (reads `?id=<slug>`)
- `about.html`, `contact.html`
- `css/style.css` — all styling
- `js/site.js` — renders everything from the JSON, handles autoplay covers, video backgrounds, press sorting, email, etc.
- `content/work.json` — **all films** (the main file to edit)
- `content/site.json` — hero, about text, brands, press, contact
- `admin/` — **Decap CMS** (`index.html` + `config.yml`) — the no-code editor at `/admin`
- `assets/` — `posters/`, `logos/` (brand logos), `laurel.png`, `logo-mark.png` (ice-cube mark), `uploads/`, `videos/`
- `_LOGOS/` — source logo files uploaded by Chris (not served)
- `README.md`, `DEPLOY.md`

## Content / data model
**`work.json` — each film has:** `id`, `title`, `year`, `clientLabel`+`client` (primary affiliation row), `clientLabel2`+`client2` and `clientLabel3`+`client3` (optional 2nd/3rd rows), `category`, `role` (hidden), `logline`, `description`, `credits[]`, `recognition[]`, `poster`, `video` (mp4), **`cover`** (imagery link for the autoplay tile), **`embed`** (the film that plays on the project page), `link`+`linkLabel` (external "Watch" button), `featured`.
- **Key architecture — cover vs. embed are separate:** `cover` = clean loop/trailer for the autoplay tile (avoids captions/company-card intros); `embed` = the real film on the project page. If `cover` is blank the tile uses `embed`.
- **Affiliation labels** (per-project dropdown): Network, Prod. Co., Client, Client / Agency, In Association With, Co-Producer, Agency, Presented By.
- **Category:** Feature, Short, Series, Branded, Episodic. (Role row is hidden site-wide — Credits covers it.)

**`site.json`:** `heroTitle`/`heroSub`, `heroEmbed` (landing bg video), `heroPoster`, `aboutLead` (2-line, `\n` = line break), `aboutBody`, `brands[{name, logo, light}]`, `press[{outlet, title, url, date}]`, `contactEmail`, `contactNote`, `aboutBgVideo`, `contactBgVideo`, `socials` (empty).

## The 22 films (current)
| # | Film | Affiliation | Cat | Film source |
|---|---|---|---|---|
| 1 | The Orchestra Chuck Built | Network: The New Yorker | Short | Vimeo (full); **cover = overpass loop**; landing hero uses this loop |
| 2 | Four Seasons Total Documentary | Network: MSNBC / Peacock | Short | YouTube trailer; **cover = Vimeo** |
| 3 | Adaptive: Paris (S01) | Network: Peacock · Prod. Co.: Vitium Productions · Presented By: Dick's Sporting Goods | Series | YouTube trailer (cover+page); "Watch on Peacock" button |
| 4 | Camp ALEC | Network: Disney+ · Co-Producer: Kennedy/Marshall | Short | poster only (Disney+ can't embed); **cover = Vimeo loop** |
| 5 | One Buck Won't Hurt | In Association With: Wrong Creative | Short | Vimeo trailer |
| 6 | Lost LA: Descanso Gardens | Network: KCET | Series | YouTube (full film); **cover = DG Sizzle** |
| 7 | Daddy Business | Network: Means TV | Short | Vimeo (Sizzle) |
| 8 | Sonic — Live Free Eat Sonic | Client: Sonic · Agency: Mother | Branded | Vimeo |
| 9 | Beyond the Vest | Client: Sam's Club · Prod. Co.: Hartbeat | Branded | Vimeo full; **cover = Vimeo loop** |
| 10 | Goat Milk Soap | Client: Chivas | Branded | Vimeo |
| 11 | Patron Saint of Jazz Fest | In Association With: DNO | Short | Vimeo full; **cover = trailer** |
| 12 | Innocence Project New Orleans | Client: IPNO | Short | Vimeo |
| 13–22 | Skater Girl, Tiny Foods, Mr. Okra, The People Walker, Weed Nuns, The Grandma Gamer, Superman of Hollywood Boulevard, I'm a Furry, Slow to Rise: Katrina, The Homeless Jedi | Network: **60 Second Docs** | Short | all Vimeo |

## Key features (how they work)
- **Video backgrounds:** landing hero, About, and Contact all play a fixed muted looping video behind the content, with a dark scrim + light text. Reusable system — a page just needs `<div id="page-bg" data-bg-key="...">` and the field in `site.json`.
- **Autoplay covers:** grid tiles show a poster still, then inject a Vimeo/YouTube **muted background video when the tile is ~50% in view** (IntersectionObserver, threshold `0.5` in `site.js`). Supports **unlisted Vimeo** (privacy hash `?h=`) and `texttrack=false` to kill captions. _(Chris feels the timing "still isn't quite right" — flagged to revisit; may be the local preview caching an old `site.js`.)_
- **Brands logo wall (About):** logos unified to one **light monochrome tone** via `grayscale(1) invert(1)` (keeps internal contrast so multi-color marks like Sonic stay legible). White-origin logos (MSNBC) flagged `light:true` to skip the invert. Logos in `assets/logos/`. Only 10 brands: Disney+, Peacock, MSNBC, The New Yorker, Kennedy/Marshall, KCET, 60 Second Docs, Sonic, Hartbeat, Sam's Club.
- **Press (About):** auto-sorted **newest-first** by a hidden `date`. Currently: Deadline (Jul 2025, Adaptive), What's On Disney+ (Jun 2025), NYT (Nov 2024, "A Photographic Memory"), Hollywood Reporter (2021), NOLA.com (2016), HuffPost (2015). All open in new tabs.
- **Recognition list:** each item prefixed with a small **festival-laurel bullet** (`assets/laurel.png`, masked white).
- **Contact email:** displays **"chillfactoryfilm AT gmail.com"** (@ → AT, anti-scrape), but clicking opens mail to the real `chillfactoryfilm@gmail.com`.
- **Ice-cube brand mark** (`assets/logo-mark.png`): hand-drawn "chill factory" mark, placed **only in the footer** to the left of "Chill Factory" (27px, hangs into the gutter so text doesn't shift; hidden < 768px).
- **Nav:** on video pages (landing/About/Contact) it's **transparent + very subtle blur (3px)** so footage flows through; on Work/project pages it's a solid dark bar.

## Design specifics
- Work + project pages = **dark theme** (`theme-dark`). About/Contact = video bg with light text. Landing = video bg, brighter **gradient** scrim. About/Contact scrim = **69%**. Nav blur = **3px**.
- Monochrome throughout — no color except the video footage itself.

## Deployment status (IMPORTANT)
- **Not deployed.** Domain **chillfactoryfilm.com** is **registered at GoDaddy**.
- **Plan (all free):** GitHub repo → Netlify hosting → Decap CMS editor. Chris still needs to **create GitHub + Netlify accounts** (has neither). Full click-by-click steps are in `DEPLOY.md` (incl. GoDaddy DNS: A record → `75.2.60.5`, CNAME `www` → netlify).
- **⚠️ Critical caveat:** most posters and some films are **hotlinked from the old Squarespace site (christopher-stoudt.com) and Vimeo/YouTube**. They'll break if the old site goes down — **upload owned files before decommissioning it.**

## Open items / to revisit
1. **Cover autoplay timing** — Chris says it still doesn't feel right; re-examine (threshold is 0.5; suspect preview cache).
2. **Replace hotlinked media** with owned uploads (posters + MP4 loops).
3. A few 60SD loglines dropped subject names when trimming redundancy (acceptable per Chris).
4. **Deploy** when ready (needs Chris's accounts).
5. NYT press headline is a clean placeholder ("'A Photographic Memory' Review") since the page is paywalled — refine if desired.
