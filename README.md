# Chill Factory — website

A clean, minimal, monochrome site for the film production company of director
Christopher Stoudt. Static HTML/CSS/JS with a **free no-code editor** on top, so
content is managed through a browser — no coding required.

**To put it online and start editing, see [DEPLOY.md](DEPLOY.md).**

## Pages
- `index.html` — home / video splash + selected work
- `work.html` — full work grid
- `project.html` — single project page (reads `?id=<slug>` from the URL)
- `about.html` — about the company + brands / press
- `contact.html` — email + social links

## How content works
All words, films, images, and videos come from two files the editor manages:
- `content/work.json` — every film
- `content/site.json` — home splash, about text, brands/press, contact info

You normally edit these through the **admin panel at `/admin`** (see DEPLOY.md).
The pages fetch these files at load time and render themselves — nothing is
hard-coded.

## The no-code editor (`/admin`)
Powered by Decap CMS (`admin/index.html` + `admin/config.yml`). After the
one-time setup in DEPLOY.md, go to `your-site/admin`, log in, and manage:
- **Films** — add/edit/reorder, feature on home, upload posters + preview MP4s,
  or paste Vimeo/YouTube links.
- **Site & Pages** — splash text, about, brands/press, contact email + socials.

Uploaded media goes to `assets/uploads/`.

## Videos (muted autoplay on scroll)
- **Preview loops**: short, muted MP4s. In the editor, set a film's *Preview
  video*; the tile then autoplays muted as it scrolls into view.
- **Full films**: paste a Vimeo or YouTube URL into a film's *link* field; it
  embeds on the project page.
- **Home splash**: set *Home — splash video* in **Site & Pages**.

Tiles without a video simply show their poster still, so the grid always looks
complete. Placeholder posters are the grayscale SVGs in `assets/posters/`.

## Run locally
Content is loaded with `fetch`, so open it through a local server (not
`file://`):
```
python3 -m http.server 8000
```
then open http://localhost:8000. To test the editor locally too:
`npx decap-server` in another terminal (see Decap docs).

## Deploy
Free on **Netlify** (connected to a GitHub repo — required for the editor).
Full walkthrough in [DEPLOY.md](DEPLOY.md). No build command; publish root is `/`.

## Temporary media (important)
Posters and film embeds are currently **pulled from the old Squarespace site
and Vimeo** as a stand-in (`content/work.json`): grid stills are
`images.squarespace-cdn.com` URLs, and six project pages embed Vimeo films.
**These will break if the old christopher-stoudt.com site is taken down** — so
upload your own posters/MP4s in the editor before decommissioning it.

## Still to do (needs Christopher)
- Upload your own **posters + MP4 preview loops** via the editor (replaces the
  temporary hotlinked media above).
- Replace the temporary YouTube video-background with a short **muted MP4 loop**
  for the home splash (`Site & Pages → Home — splash video`, which overrides the
  YouTube URL in `Home — splash video background`). **Target clip:** the overpass
  shot into the striking chair shots that follow in *The Orchestra Chuck Built*
  (~10–15s).
- Register **chillfactoryfilm.com** (it's available) — hosting/SSL stay free.
- Fill real **credits** per film; confirm the few blank **years**.
- *The Black Rebel* and *Ryan's Recycling* aren't on the old site — add
  posters/videos and (for Black Rebel) a real description.

## Folder map
```
index / work / project / about / contact .html   the pages
css/style.css                                     all styling
js/site.js                                        renders content, video autoplay
content/work.json, content/site.json              your editable content
admin/                                            the no-code editor
assets/posters/                                   placeholder + real stills
assets/videos/, assets/uploads/                   your video files
```
