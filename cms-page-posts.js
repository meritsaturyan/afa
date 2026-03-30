/**
 * Loads per-page posts from AFA CMS API into [data-cms-page] mounts.
 * Set window.CMS_ORIGIN (e.g. http://localhost:3847) like cms-loader.js.
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

  function assetUrl(path) {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.indexOf("/uploads/") === 0) return CMS_ORIGIN + path;
    var pre = langPathPrefix();
    if (pre && path.indexOf("public/") === 0) return pre + "/" + path;
    return path;
  }

  function esc(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderNewsLi(post) {
    var href = post.link && String(post.link).trim() ? post.link : "#";
    var img = assetUrl(post.image);
    var title = esc(post.title);
    var desc =
      post.excerpt && String(post.excerpt).trim()
        ? '<div class="news_description">' + esc(post.excerpt) + "</div>"
        : "";
    return (
      "<li><div class=\"news_block combo_hover\"><div class=\"image_block\"><a href=\"" +
      esc(href) +
      "\" class=\"news_image combo_link\"><img src=\"" +
      esc(img) +
      "\" alt=\"" +
      title +
      "\"></a></div><div class=\"news_title\"><a href=\"" +
      esc(href) +
      "\" class=\"combo_link\">" +
      title +
      "</a></div>" +
      desc +
      "</div></li>"
    );
  }

  function renderCouncilCard(post) {
    var imgHtml = post.image
      ? '<img src="' + esc(assetUrl(post.image)) + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%">'
      : "👤";
    var sub =
      post.subtitle && String(post.subtitle).trim()
        ? '<p class="member_position">' + esc(post.subtitle) + "</p>"
        : "";
    var ex =
      post.excerpt && String(post.excerpt).trim()
        ? '<p class="member_description">' + esc(post.excerpt) + "</p>"
        : "";
    return (
      '<div class="council_member_card"><div class="member_avatar">' +
      imgHtml +
      '</div><h3 class="member_name">' +
      esc(post.title) +
      "</h3>" +
      sub +
      ex +
      "</div>"
    );
  }

  function renderExecutiveCard(post) {
    var imgHtml = post.image
      ? '<img src="' + esc(assetUrl(post.image)) + '" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%">'
      : "👔";
    var sub =
      post.subtitle && String(post.subtitle).trim()
        ? '<p class="member_position">' + esc(post.subtitle) + "</p>"
        : "";
    var ex =
      post.excerpt && String(post.excerpt).trim()
        ? '<p class="member_description">' + esc(post.excerpt) + "</p>"
        : "";
    return (
      '<div class="executive_member_card"><div class="member_avatar">' +
      imgHtml +
      '</div><h3 class="member_name">' +
      esc(post.title) +
      "</h3>" +
      sub +
      ex +
      "</div>"
    );
  }

  function applyPayload(mount, layout, posts) {
    var list = posts || [];
    if (layout === "council") {
      mount.innerHTML = list.map(renderCouncilCard).join("");
      return;
    }
    if (layout === "executive") {
      mount.innerHTML = list.map(renderExecutiveCard).join("");
      return;
    }
    var html = list.map(renderNewsLi).join("");
    if (mount.tagName && mount.tagName.toLowerCase() === "ul") {
      mount.innerHTML = html;
    } else {
      mount.innerHTML = '<ul class="news_list">' + html + "</ul>";
    }
  }

  function run() {
    var mount = document.querySelector("[data-cms-page]");
    if (!mount) return;
    var slug = mount.getAttribute("data-cms-page");
    if (!slug) return;
    var apiBase = CMS_ORIGIN;
    if (!apiBase) {
      if (typeof window === "undefined" || !window.location || window.location.protocol === "file:") return;
      apiBase = "";
    }
    var url = apiBase + "/api/public/page/" + encodeURIComponent(slug) + "?lang=" + encodeURIComponent(LANG);
    fetch(url, { credentials: "omit" })
      .then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then(function (data) {
        var layout = data.layout || "news";
        applyPayload(mount, layout, data.posts);
      })
      .catch(function () {
        /* keep static fallback */
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
