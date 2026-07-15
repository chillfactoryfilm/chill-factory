/* =============================================================================
   CHILL FACTORY — site behavior
   Content is loaded from content/work.json + content/site.json (both edited
   through the no-code admin at /admin/). This file renders it. No dependencies.
============================================================================= */
(function () {
  "use strict";

  var PROJECTS = [];
  var SITE = {};

  /* ---- boot: load content, then render --------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    setupNav();
    Promise.all([
      fetchJSON("content/work.json"),
      fetchJSON("content/site.json"),
    ]).then(function (res) {
      PROJECTS = (res[0] && res[0].projects) || [];
      SITE = res[1] || {};
      bindSite();
      renderGrid("[data-grid='featured']", PROJECTS.filter(function (p) { return p.featured; }));
      renderGrid("[data-grid='all']", PROJECTS);
      renderProject();
      setupVideoAutoplay();
      setupAutoplayCovers();
      setupReveal();
    }).catch(function (err) {
      console.error("Content failed to load:", err);
    });
  });

  function fetchJSON(path) {
    // cache-bust so edits show immediately after a redeploy
    return fetch(path, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(path + " → " + r.status);
      return r.json();
    });
  }

  /* ---- bind site.json into the page ------------------------------------ */
  function bindSite() {
    // simple text bindings: <el data-site="heroSub">
    document.querySelectorAll("[data-site]").forEach(function (el) {
      var key = el.getAttribute("data-site");
      var val = SITE[key];
      if (val == null) return;
      if (String(val).indexOf("\n") !== -1) {
        el.innerHTML = String(val).split(/\n/).map(escapeHTML).join("<br>");
      } else {
        el.textContent = val;
      }
    });

    // hero splash: MP4 video, or YouTube/Vimeo video background, or poster still
    var hm = document.getElementById("hero-media");
    if (hm) {
      var poster = SITE.heroPoster || "";
      var fallback = '<img class="hero-fallback" src="' + escapeAttr(poster) + '" alt="">';
      if (SITE.heroVideo) {
        hm.innerHTML = '<video autoplay muted loop playsinline preload="metadata" poster="' +
          escapeAttr(poster) + '"><source src="' + escapeAttr(SITE.heroVideo) + '" type="video/mp4"></video>';
      } else if (SITE.heroEmbed && getYouTubeId(SITE.heroEmbed)) {
        var yt = getYouTubeId(SITE.heroEmbed);
        hm.innerHTML = fallback + '<iframe class="hero-frame" src="https://www.youtube.com/embed/' + yt +
          "?autoplay=1&mute=1&loop=1&playlist=" + yt +
          "&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&iv_load_policy=3&showinfo=0" +
          "&cc_load_policy=0&cc_lang_pref=none" +
          '" allow="autoplay" title="Background" tabindex="-1"></iframe>';
      } else if (SITE.heroEmbed && parseVimeo(SITE.heroEmbed)) {
        var hv = parseVimeo(SITE.heroEmbed);
        hm.innerHTML = fallback + '<iframe class="hero-frame" src="https://player.vimeo.com/video/' + hv.id +
          "?background=1&autoplay=1&muted=1&loop=1&autopause=0&dnt=1&texttrack=false" +
          (hv.hash ? "&h=" + hv.hash : "") +
          '" allow="autoplay" title="Background" tabindex="-1"></iframe>';
      } else {
        hm.innerHTML = '<img src="' + escapeAttr(poster) + '" alt="">';
      }
    }

    // fixed page background video — link comes from the site field named in
    // the #page-bg data-bg-key (defaults to aboutBgVideo)
    var pageBg = document.getElementById("page-bg");
    var bgLink = pageBg ? SITE[pageBg.getAttribute("data-bg-key") || "aboutBgVideo"] : null;
    if (pageBg && bgLink) {
      var pv = parseVimeo(bgLink);
      var yv = pv ? null : getYouTubeId(bgLink);
      if (pv) {
        pageBg.innerHTML = '<iframe src="https://player.vimeo.com/video/' + pv.id +
          "?background=1&autoplay=1&muted=1&loop=1&autopause=0&dnt=1&texttrack=false" +
          (pv.hash ? "&h=" + pv.hash : "") +
          '" allow="autoplay" title="Background" tabindex="-1"></iframe>';
      } else if (yv) {
        pageBg.innerHTML = '<iframe src="https://www.youtube.com/embed/' + yv +
          "?autoplay=1&mute=1&loop=1&playlist=" + yv +
          "&controls=0&modestbranding=1&rel=0&playsinline=1&showinfo=0&iv_load_policy=3&cc_load_policy=0&disablekb=1&fs=0" +
          '" allow="autoplay" title="Background" tabindex="-1"></iframe>';
      }
    }

    // about: multi-paragraph body + brand/press grids
    var body = document.querySelector("[data-site-body]");
    if (body && SITE.aboutBody) {
      body.innerHTML = String(SITE.aboutBody).split(/\n{2,}/)
        .map(function (p) { return "<p>" + escapeHTML(p) + "</p>"; }).join("");
    }
    // brands: logo cluster (logo image if provided, else the name in type)
    var brandsEl = document.querySelector("[data-brands]");
    if (brandsEl && SITE.brands) {
      brandsEl.innerHTML = SITE.brands.map(function (b) {
        var name = typeof b === "string" ? b : b.name;
        var logo = typeof b === "string" ? "" : b.logo;
        var light = typeof b === "object" && b.light ? " logo--light" : "";
        var inner = logo
          ? '<img class="brand-logo" src="' + escapeAttr(logo) + '" alt="' + escapeAttr(name) + '" loading="lazy">'
          : '<span class="brand-name">' + escapeHTML(name) + "</span>";
        return '<div class="logo-item' + light + '">' + inner + "</div>";
      }).join("");
    }

    // press: linked article list (outlet + headline)
    var pressEl = document.querySelector("[data-press]");
    if (pressEl && SITE.press) {
      var press = SITE.press.slice().sort(function (a, b) {
        return String(b.date || "").localeCompare(String(a.date || "")); // newest first
      });
      pressEl.innerHTML = press.map(function (p) {
        return '<a class="press-item" href="' + escapeAttr(p.url) + '" target="_blank" rel="noopener">' +
          '<span class="press-outlet">' + escapeHTML(p.outlet) + "</span>" +
          '<span class="press-title">' + escapeHTML(p.title) + "</span>" +
          '<span class="press-arrow" aria-hidden="true">↗</span></a>';
      }).join("");
    }

    // contact: email + socials
    document.querySelectorAll("[data-email]").forEach(function (el) {
      if (!SITE.contactEmail) return;
      // display the "@" as "AT" (discourages scraping); dots stay so it fits one line
      el.textContent = SITE.contactEmail.replace("@", " AT ");
      el.setAttribute("href", "mailto:" + SITE.contactEmail);
    });
    var soc = document.querySelector("[data-socials]");
    if (soc) {
      if (SITE.socials && SITE.socials.length) {
        soc.innerHTML = SITE.socials.map(function (s) {
          return '<a href="' + escapeAttr(s.url) + '" target="_blank" rel="noopener">' + escapeHTML(s.label) + "</a>";
        }).join("");
      } else {
        soc.style.display = "none";
      }
    }
    // footer email links
    document.querySelectorAll("[data-email-link]").forEach(function (el) {
      if (SITE.contactEmail) el.setAttribute("href", "mailto:" + SITE.contactEmail);
    });
  }

  function fillCells(sel, arr) {
    var el = document.querySelector(sel);
    if (el && arr) el.innerHTML = arr.map(function (b) {
      return '<div class="logo-cell">' + escapeHTML(b) + "</div>";
    }).join("");
  }

  /* ---- media element for a card ---------------------------------------- */
  function mediaEl(p) {
    if (p.video) {
      return '<video class="tile-video" muted loop playsinline preload="metadata" poster="' +
        escapeAttr(p.poster) + '"><source src="' + escapeAttr(p.video) + '" type="video/mp4"></video>';
    }
    return '<img src="' + escapeAttr(p.poster) + '" alt="' + escapeAttr(p.title) + '" loading="lazy">';
  }

  function cardHTML(p) {
    // Autoplay cover imagery: use the dedicated `cover` link if set, else the
    // film's `embed`. (Covers use loops/trailers to avoid captions + intro cards;
    // the project page still plays the real film via `embed`.)
    var coverSrc = p.cover || p.embed;
    var vim = (!p.video && coverSrc) ? parseVimeo(coverSrc) : null;
    var yt = (!p.video && coverSrc && !vim) ? getYouTubeId(coverSrc) : null;
    var attr = "";
    if (vim) attr = ' data-vimeo="' + escapeAttr(vim.id) + '"' +
      (vim.hash ? ' data-vimeo-h="' + escapeAttr(vim.hash) + '"' : "");
    else if (yt) attr = ' data-youtube="' + escapeAttr(yt) + '"';
    return '<a class="card reveal" href="project.html?id=' + encodeURIComponent(p.id) + '">' +
      '<div class="card-media"' + attr + ">" + mediaEl(p) + "</div>" +
      '<div class="card-meta"><span class="card-title">' + escapeHTML(p.title) +
      '</span><span class="card-client">' + escapeHTML(p.client || "") + "</span></div></a>";
  }

  function renderGrid(sel, list) {
    var el = document.querySelector(sel);
    if (el) el.innerHTML = list.map(cardHTML).join("");
  }

  /* ---- embed (Vimeo / YouTube) → iframe -------------------------------- */
  function getVimeoId(url) {
    var m = String(url || "").match(/vimeo\.com\/(?:video\/)?(\d{6,})/);
    return m ? m[1] : null;
  }
  // Vimeo links may be unlisted: vimeo.com/<id>/<privacyHash>. Capture both.
  function parseVimeo(url) {
    var m = String(url || "").match(/vimeo\.com\/(?:video\/)?(\d{6,})(?:\/([0-9a-zA-Z]+))?/);
    if (!m) return null;
    return { id: m[1], hash: m[2] || null };
  }
  function getYouTubeId(url) {
    url = String(url || "");
    var m = url.match(/[?&]v=([\w-]{6,})/) || url.match(/youtu\.be\/([\w-]{6,})/) ||
      url.match(/youtube\.com\/embed\/([\w-]{6,})/);
    return m ? m[1] : null;
  }
  function embedFrame(url) {
    var src = "";
    var vim = parseVimeo(url);
    var ytLong = url.match(/[?&]v=([\w-]+)/);
    var ytShort = url.match(/youtu\.be\/([\w-]+)/);
    var ytEmbed = url.match(/youtube\.com\/embed\/([\w-]+)/);
    if (vim) {
      var vp = [];
      if (vim.hash) vp.push("h=" + vim.hash);
      // strip player chrome: no title/byline/portrait/badge, and hide the
      // like / watch-later / share / Vimeo-logo overlays. NOTE: like, watchlater
      // and logo are only honoured on a paid Vimeo plan (Plus/Pro+) — they are
      // ignored (chrome stays) on free/Basic accounts, but harmless to send.
      vp.push("title=0", "byline=0", "portrait=0", "badge=0",
              "like=0", "watchlater=0", "share=0", "logo=0",
              "dnt=1", "texttrack=false");
      src = "https://player.vimeo.com/video/" + vim.id + "?" + vp.join("&");
    }
    else {
      // YouTube: minimise branding + no related videos at the end
      var ytp = "?modestbranding=1&rel=0&iv_load_policy=3&playsinline=1";
      if (ytLong) src = "https://www.youtube.com/embed/" + ytLong[1] + ytp;
      else if (ytShort) src = "https://www.youtube.com/embed/" + ytShort[1] + ytp;
      else if (ytEmbed) src = "https://www.youtube.com/embed/" + ytEmbed[1] + ytp;
    }
    if (!src) return "";
    return '<iframe src="' + escapeAttr(src) + '" style="position:absolute;inset:0;width:100%;height:100%;border:0" ' +
      'allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
  }

  /* ---- muted scroll-autoplay ------------------------------------------- */
  function setupVideoAutoplay() {
    var vids = document.querySelectorAll("video.tile-video, video[data-autoplay]");
    if (!vids.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && e.intersectionRatio > 0.35) {
          var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
        } else { v.pause(); }
      });
    }, { threshold: [0, 0.35, 0.6] });
    vids.forEach(function (v) { io.observe(v); });
  }

  /* ---- Vimeo/YouTube autoplay covers (lazy) ---------------------------- */
  function setupAutoplayCovers() {
    var tiles = document.querySelectorAll(".card-media[data-vimeo], .card-media[data-youtube]");
    if (!tiles.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var el = e.target;
        if (e.isIntersecting && e.intersectionRatio >= 0.5) {
          if (!el.querySelector("iframe")) el.appendChild(coverFrame(el));
        } else {
          var ex = el.querySelector("iframe");
          if (ex) ex.remove(); // free resources when off-screen
        }
      });
    }, { threshold: [0, 0.5, 0.7] });
    tiles.forEach(function (t) { io.observe(t); });
  }
  function coverFrame(el) {
    var f = document.createElement("iframe");
    var vid = el.getAttribute("data-vimeo"), yt = el.getAttribute("data-youtube");
    if (vid) {
      var h = el.getAttribute("data-vimeo-h");
      f.src = "https://player.vimeo.com/video/" + vid +
        "?background=1&autoplay=1&muted=1&loop=1&autopause=0&dnt=1&texttrack=false" + (h ? "&h=" + h : "");
    } else {
      f.src = "https://www.youtube.com/embed/" + yt +
        "?autoplay=1&mute=1&loop=1&playlist=" + yt +
        "&controls=0&modestbranding=1&rel=0&playsinline=1&showinfo=0&iv_load_policy=3&cc_load_policy=0&disablekb=1&fs=0";
    }
    f.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
    f.setAttribute("title", "Preview");
    f.setAttribute("tabindex", "-1");
    return f;
  }

  /* ---- reveal on scroll ------------------------------------------------- */
  function setupReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); }); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- mobile nav ------------------------------------------------------- */
  function setupNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () { links.classList.toggle("open"); });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  /* ---- project detail page --------------------------------------------- */
  function renderProject() {
    var root = document.getElementById("project-root");
    if (!root) return;
    var id = new URLSearchParams(location.search).get("id");
    var idx = PROJECTS.findIndex(function (p) { return p.id === id; });
    if (idx === -1) {
      root.innerHTML = '<div class="wrap section"><a class="back-link" href="work.html">← All Work</a>' +
        '<h1 class="project-title">Not found</h1><p class="logline">That project doesn\'t exist. ' +
        '<a href="work.html" style="text-decoration:underline">Back to the work.</a></p></div>';
      return;
    }
    var p = PROJECTS[idx];
    document.title = (p.title + " — Chill Factory").toUpperCase();

    var hero;
    if (p.embed) hero = embedFrame(p.embed) || fallbackHero(p);
    else hero = fallbackHero(p);

    var metaRows = [
      ["Year", p.year],
      [p.clientLabel || "Client", p.client],
      [p.clientLabel2, p.client2],
      [p.clientLabel3, p.client3],
      ["Category", p.category],
      // Role row hidden — Credits covers it (and allows fuller crew later)
    ]
      .filter(function (r) { return r[0] && r[1]; })
      .map(function (r) { return '<div class="meta-row"><dt>' + escapeHTML(r[0]) + "</dt><dd>" + escapeHTML(r[1]) + "</dd></div>"; })
      .join("");

    var creditsBlock = listBlock("Credits", p.credits);
    var recBlock = listBlock("Recognition", p.recognition, "tag-block--laurels");
    var watch = p.link
      ? '<a class="watch-btn" href="' + escapeAttr(p.link) + '" target="_blank" rel="noopener">' +
        escapeHTML(p.linkLabel || "Watch the film") + " ↗</a>" : "";
    var descHTML = p.description
      ? String(p.description).split(/\n{2,}/).map(function (para) { return "<p>" + escapeHTML(para) + "</p>"; }).join("")
      : "";

    var prev = PROJECTS[idx - 1], next = PROJECTS[idx + 1];
    var prevLink = prev ? '<a href="project.html?id=' + encodeURIComponent(prev.id) + '">← ' + escapeHTML(prev.title) + "</a>" : '<span class="disabled">←</span>';
    var nextLink = next ? '<a href="project.html?id=' + encodeURIComponent(next.id) + '">' + escapeHTML(next.title) + " →</a>" : '<span class="disabled">→</span>';

    root.innerHTML =
      '<div class="wrap section"><a class="back-link" href="work.html">← All Work</a>' +
      '<div class="project-hero">' + hero + "</div>" +
      '<div class="project-grid"><div class="project-body">' +
      '<h1 class="project-title">' + escapeHTML(p.title) + "</h1>" +
      (p.logline ? '<p class="logline">' + escapeHTML(p.logline) + "</p>" : "") +
      descHTML + watch + "</div><aside>" +
      '<dl class="meta-list">' + metaRows + "</dl>" + creditsBlock + recBlock +
      "</aside></div>" +
      '<nav class="prevnext">' + prevLink + nextLink + "</nav></div>";
  }

  function fallbackHero(p) {
    return p.video
      ? '<video data-autoplay muted loop playsinline preload="metadata" poster="' + escapeAttr(p.poster) + '"><source src="' + escapeAttr(p.video) + '" type="video/mp4"></video>'
      : '<img src="' + escapeAttr(p.poster) + '" alt="' + escapeAttr(p.title) + '">';
  }
  function listBlock(title, arr, cls) {
    if (!arr || !arr.length) return "";
    return '<div class="tag-block' + (cls ? " " + cls : "") + '"><h3>' + title + "</h3><ul>" +
      arr.map(function (x) { return "<li>" + escapeHTML(x) + "</li>"; }).join("") + "</ul></div>";
  }

  /* ---- helpers ---------------------------------------------------------- */
  function escapeHTML(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function escapeAttr(s) { return escapeHTML(s).replace(/"/g, "&quot;"); }
})();
