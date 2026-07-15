# Getting Chill Factory online — step by step

Everything here is **free** except one thing: a custom domain name costs about
**$12/year** to register (nobody can make that part free). Hosting, the editor,
and SSL are all $0.

You'll need to create two free accounts — **GitHub** (stores the site) and
**Netlify** (hosts it + powers the editor). I can't create accounts or buy the
domain for you, but I've done all the building; these are click-through steps.

> Prefer to have me walk you through it live? Just say so and we'll do it
> together, one step at a time.

---

## Part A — Put the site online (~10 min)

1. **Make a free GitHub account** at github.com (skip if you have one).
2. Create a new **repository** (call it `chill-factory`). Keep it Public or
   Private — either works.
3. Upload this whole `WEBSITE` folder into the repo. Easiest way: on the repo
   page click **"uploading an existing file"** and drag in all the files.
   (If you'd rather, I can prep it so it's a single drag-and-drop.)
4. **Make a free Netlify account** at netlify.com — choose **"Sign up with
   GitHub."**
5. In Netlify: **Add new site → Import an existing project → GitHub →** pick your
   `chill-factory` repo.
6. Leave build settings **blank** (there's no build step) and click **Deploy.**

Your site is now live at a free address like `random-name.netlify.app`.
You can rename it under **Site configuration → Change site name** to e.g.
`chillfactory.netlify.app`.

---

## Part B — Turn on the no-code editor (~5 min, one time)

The editor lives at **your-site.netlify.app/admin**. To let it save changes:

1. In Netlify, open your site → **Integrations / Identity** → **Enable
   Identity.**
2. Under **Identity → Registration**, set it to **Invite only** (so only you can
   log in).
3. Under **Identity → Services → Git Gateway**, click **Enable Git Gateway.**
4. Under **Identity**, click **Invite users** and invite **your own email**
   (hothotsax@gmail.com or whichever you prefer).
5. Check your email, click the invite link, set a password.
6. Go to **your-site.netlify.app/admin** and log in. You'll see **Films** and
   **Site & Pages** — edit away.

> Note: if Netlify Identity isn't offered on your plan when you get there, tell
> me — there's a drop-in free alternative (Sveltia CMS) that uses the same setup
> and I can switch it in a minute.

---

## Part C — Point chillfactoryfilm.com (GoDaddy) at the site

The domain is registered at **GoDaddy**. Keep it there — you just add two DNS
records so it points at the free Netlify hosting. SSL/HTTPS is automatic and free.

1. In **Netlify**: your site → **Domain management → Add a custom domain** →
   type `chillfactoryfilm.com` → **Verify** → add it (also add the `www` version
   when prompted).
2. Netlify will show the exact DNS values to use. They are normally:
   - an **A record**: Host `@`  →  Value `75.2.60.5`
   - a **CNAME record**: Host `www`  →  Value `your-site-name.netlify.app`
   *(Use whatever Netlify actually displays — those override the above.)*
3. In **GoDaddy**: log in → **My Products → Domains → chillfactoryfilm.com →
   DNS / Manage DNS**. 
   - Edit the existing **A record** (`@`) to the Netlify IP above (delete the
     GoDaddy "Parked" record if present).
   - Add/edit the **CNAME** for `www` to your `.netlify.app` address.
   - Save.
4. Back in Netlify, click **Verify DNS configuration**. Propagation takes minutes
   to a few hours; Netlify then issues the SSL certificate automatically.
5. Done — the site loads at `https://chillfactoryfilm.com`.

> Prefer to hand DNS to Netlify entirely? You can instead change GoDaddy's
> **nameservers** to Netlify's. Simpler long-term, but it moves all DNS to
> Netlify. The A/CNAME method above keeps everything at GoDaddy. I'll advise
> whichever you pick.

---

## Part D — Using the editor day to day

Go to **/admin**, log in, then:

- **Films → All Films** — add a film (click **Add**, fill the form), reorder by
  dragging, toggle **Feature on home page**, upload a **poster** image and a
  **preview video** (short muted MP4), or paste a **Vimeo/YouTube link** for the
  full film. Give each film a unique **ID / slug** (lowercase-with-hyphens).
- **Site & Pages** — edit the home splash text, about page, brands/press lists,
  and contact email/socials.
- Click **Publish** — your change is saved and the live site updates in a minute
  or two automatically.

That's it. You never touch code.

---

## What I still need from you to finish the real content
- **Videos**: MP4 preview loops, Vimeo, or YouTube links (any mix). Send them and
  I'll wire them in, or upload them yourself in the editor.
- **The custom domain name** you want (I'll verify availability).
- **Real social URLs** (Instagram / IMDb / Vimeo) — currently placeholders.
- Confirmation of a few **years** left blank, and the real **credits** per film.
