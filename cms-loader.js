/**
 * Loads homepage content from AFA CMS API.
 * Before this script: set window.CMS_ORIGIN = 'http://localhost:3847' (dev) or '' (same-origin prod).
 */
(function () {
  "use strict";

  var CMS_ORIGIN =
    typeof window !== "undefined" && window.CMS_ORIGIN != null && String(window.CMS_ORIGIN).trim() !== ""
      ? String(window.CMS_ORIGIN).replace(/\/$/, "")
      : "";

  var LANG = (document.documentElement.getAttribute("lang") || "am").toLowerCase().slice(0, 2);
  if (LANG !== "en" && LANG !== "ru") LANG = "am";

  function langPathPrefix() {
    var p = window.location.pathname || "";
    if (/(^|\/)(en|ru)(\/|$)/.test(p)) return "..";
    return "";
  }

  var _pp = langPathPrefix();
  var DEFAULT_HERO_IMAGES = [
    (_pp ? _pp + "/" : "") + "public/background.jpg",
    (_pp ? _pp + "/" : "") + "public/hamajoxov.jpg",
    (_pp ? _pp + "/" : "") + "public/korporativ.jpg",
    (_pp ? _pp + "/" : "") + "public/hamajoxov5.jpg",
    (_pp ? _pp + "/" : "") + "public/korporativ1.jpg",
  ];

  function esc(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function assetUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.indexOf("/uploads/") === 0) return CMS_ORIGIN + path;
    var pre = langPathPrefix();
    if (pre && path.indexOf("public/") === 0) return pre + "/" + path;
    return path;
  }

  function cssUrl(src) {
    var u = assetUrl(src);
    return 'url("' + String(u).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '")';
  }

  function initHeroCrossfade(images) {
    var list = images && images.length ? images : DEFAULT_HERO_IMAGES;
    var layerA = document.getElementById("heroLayerA");
    var layerB = document.getElementById("heroLayerB");
    var dotsWrap = document.getElementById("heroDots");
    if (!layerA || !layerB || !dotsWrap) return;

    dotsWrap.innerHTML = "";
    var current = 0;
    var imgIndex = 0;
    var dots = [];

    list.forEach(function (src) {
      try {
        new Image().src = assetUrl(src);
      } catch (e) {}
    });

    list.forEach(function (_, i) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "hero_dot";
      d.setAttribute("aria-label", "Slide " + (i + 1));
      d.addEventListener("click", function () {
        goTo(i);
      });
      dotsWrap.appendChild(d);
      dots.push(d);
    });

    function setActiveDot(i) {
      dots.forEach(function (d, idx) {
        d.classList.toggle("active", idx === i);
      });
    }

    function goTo(idx) {
      imgIndex = idx;
      var url = cssUrl(list[idx]);
      if (current === 0) {
        layerB.style.backgroundImage = url;
        layerB.style.opacity = "1";
        layerA.style.opacity = "0";
        current = 1;
      } else {
        layerA.style.backgroundImage = url;
        layerA.style.opacity = "1";
        layerB.style.opacity = "0";
        current = 0;
      }
      setActiveDot(idx);
    }

    layerA.style.backgroundImage = cssUrl(list[0]);
    layerA.style.opacity = "1";
    setActiveDot(0);

    if (window.__heroInterval) clearInterval(window.__heroInterval);
    window.__heroInterval = setInterval(function () {
      goTo((imgIndex + 1) % list.length);
    }, 5000);
  }

  function applyHeroText(hero) {
    var block = document.querySelector(".hero_inner");
    if (!block || !hero) return;
    var p = block.querySelector("p");
    var a = block.querySelector("a.standard_btn");
    var loc = hero[LANG] || hero.am || {};
    if (p && loc.text) p.textContent = loc.text;
    if (a) {
      if (loc.ctaText) a.textContent = loc.ctaText;
      if (loc.ctaHref) a.setAttribute("href", loc.ctaHref);
    }
  }

  function applyAbout(about) {
    if (!about) return;
    var inner = document.querySelector(".about_section .section_inner");
    if (!inner) return;
    var loc = about[LANG] || about.am || {};
    var h2 = inner.querySelector("h2.section_title");
    var st = inner.querySelector(".standard_text");
    var btn = inner.querySelector("a.standard_btn");
    if (h2 && loc.title) h2.textContent = loc.title;
    if (st && loc.bodyHtml) st.innerHTML = loc.bodyHtml;
    if (btn) {
      if (loc.buttonText) btn.textContent = loc.buttonText;
      if (loc.buttonHref) btn.setAttribute("href", loc.buttonHref);
    }
  }

  function applyNewsSection(meta) {
    if (!meta) return;
    var sec = document.querySelector(".news_section");
    if (!sec) return;
    var loc = meta[LANG] || meta.am || {};
    var h2 = sec.querySelector(".section_head .section_title");
    var va = sec.querySelector(".view_all_link a");
    if (h2 && loc.title) h2.textContent = loc.title;
    if (va) {
      if (loc.viewAllText) va.textContent = loc.viewAllText;
      if (loc.viewAllHref) va.setAttribute("href", loc.viewAllHref);
    }
  }

  function buildNewsItem(n) {
    var title = (n.title && (n.title[LANG] || n.title.am)) || "";
    var excerpt = (n.excerpt && (n.excerpt[LANG] || n.excerpt.am)) || "";
    var tag = n.tag || "ՀՖԱ";
    var href = n.link || "#";
    var img = assetUrl(n.image || "public/logo.jpg");
    return (
      '<div class="news_list_col cb">' +
      '<div class="news_block combo_hover">' +
      '<div class="image_block">' +
      '<a href="' +
      esc(href) +
      '" class="news_image combo_link">' +
      '<img src="' +
      esc(img) +
      '" alt="' +
      esc(title) +
      '">' +
      "</a>" +
      '<div class="tags_list" style="opacity: 1;"><ul class="list_inner"><li><a href="' +
      esc(href) +
      '">' +
      esc(tag) +
      "</a></li></ul></div>" +
      "</div>" +
      '<div class="news_date">' +
      esc(n.date || "") +
      "</div>" +
      '<div class="news_title"><a href="' +
      esc(href) +
      '" class="combo_link">' +
      esc(title) +
      "</a></div>" +
      '<div class="news_description">' +
      esc(excerpt) +
      "</div>" +
      "</div></div>"
    );
  }

  function applyNewsGrid(news) {
    var grid = document.querySelector(".news_section .news_grid_static");
    if (!grid || !news || !news.length) return;
    grid.innerHTML = news.slice(0, 3).map(buildNewsItem).join("");
  }

  function applyMembership(block) {
    if (!block || !block.items) return;
    var ul = document.querySelector(".membership .adv_list");
    if (!ul) return;
    var titleEl = document.querySelector(".membership .section_title");
    var tloc = block.title || {};
    if (titleEl) titleEl.textContent = tloc[LANG] || tloc.am || titleEl.textContent;
    ul.innerHTML = block.items
      .map(function (it) {
        var tit = (it.title && (it.title[LANG] || it.title.am)) || "";
        var tx = (it.text && (it.text[LANG] || it.text.am)) || "";
        return (
          "<li>" +
          '<div class="image_block"><img alt="" height="128" width="200" src="' +
          esc(assetUrl(it.image)) +
          '"></div>' +
          '<div class="title_block">' +
          esc(tit) +
          "</div>" +
          '<div class="standard_text">' +
          esc(tx) +
          "</div>" +
          "</li>"
        );
      })
      .join("");
  }

  function applyStats(block) {
    if (!block || !block.items) return;
    var wrap = document.querySelector(".stats_section .title_block");
    var ul = document.querySelector(".stats_section .stats_list");
    if (!ul) return;
    if (wrap) {
      var h2 = wrap.querySelector(".section_title");
      var intro = wrap.querySelector(".standard_text");
      var tl = block.title || {};
      if (h2) h2.textContent = tl[LANG] || tl.am || h2.textContent;
      var ih = (block.introHtml && (block.introHtml[LANG] || block.introHtml.am)) || "";
      if (intro) intro.innerHTML = ih;
    }
    ul.innerHTML = block.items
      .map(function (it) {
        var typ = (it.type && (it.type[LANG] || it.type.am)) || "";
        var tx = (it.text && (it.text[LANG] || it.text.am)) || "";
        return (
          "<li><div class=\"stat_block\">" +
          '<div class="size_block">' +
          esc(it.value) +
          "</div>" +
          '<div class="stat_type">' +
          esc(typ) +
          "</div>" +
          '<div class="standard_text">' +
          esc(tx) +
          "</div></div></li>"
        );
      })
      .join("");
  }

  function load() {
    var url = (CMS_ORIGIN || "") + "/api/public/home?lang=" + encodeURIComponent(LANG);
    fetch(url, { credentials: "omit" })
      .then(function (r) {
        if (!r.ok) throw new Error("cms");
        return r.json();
      })
      .then(function (data) {
        var home = data.home || {};
        initHeroCrossfade(home.heroImages);
        applyHeroText(home.hero);
        applyAbout(home.about);
        applyNewsSection(home.newsSection);
        applyNewsGrid(data.news || []);
        applyMembership(home.membership);
        applyStats(home.stats);
      })
      .catch(function () {
        initHeroCrossfade(DEFAULT_HERO_IMAGES);
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", load);
  else load();
})();
