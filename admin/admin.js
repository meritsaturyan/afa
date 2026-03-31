(function () {
  "use strict";

  /** CMS API base (no trailing slash). Դատարկ = նույն origin (օր. http://localhost:3847/admin/) */
  function resolveApiBase() {
    if (typeof window.CMS_ADMIN_API === "string" && window.CMS_ADMIN_API.length) {
      return window.CMS_ADMIN_API.replace(/\/$/, "");
    }
    if (location.protocol === "file:") {
      return "http://localhost:3847";
    }
    var p = location.port;
    var h = location.hostname;
    if (
      h === "localhost" ||
      h === "127.0.0.1"
    ) {
      if (p === "5500" || p === "5501" || p === "8080" || p === "3000" || p === "5173" || p === "4173") {
        return "http://localhost:3847";
      }
    }
    return "";
  }

  var API = resolveApiBase();

  function parseApiJson(r) {
    return r.text().then(function (text) {
      var data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error(
          "Սերվերը JSON չի վերադարձրել (ստուգեք CMS՝ " +
            (API || location.origin) +
            ")։ Հաճախ ադմինը պետք է բացել CMS-ի հասցեից, ոչ թե Live Server-ից։"
        );
      }
      if (!r.ok) {
        var msg = (data && data.error) || r.statusText || String(r.status);
        throw new Error(msg);
      }
      return data;
    });
  }

  function $(id) {
    return document.getElementById(id);
  }

  var state = null;

  var PAGE_SLUGS = [
    "gorcuneutyun",
    "khorhurd",
    "gorcakir",
    "handzhnajhoghovner",
    "ashxatatexer",
    "andamner",
    "mijotsaranner",
    "harotsaruytsner",
    "haytararutyunner",
  ];

  var PAGE_LABELS = {
    gorcuneutyun: "Գործունեություն",
    khorhurd: "Խորհուրդ (khorhurd)",
    gorcakir: "Գործադիր մարմին (gorcakir)",
    handzhnajhoghovner: "Հանձնաժողովներ",
    ashxatatexer: "Աշխատատեղեր",
    andamner: "Անդամներ",
    mijotsaranner: "Միջոցառումներ",
    harotsaruytsner: "Հարցազրույցներ",
    haytararutyunner: "Հայտարարություններ",
  };

  var LAYOUT_HINTS = {
    news: "Դասավորություն՝ քարտերի ցանց (որպես Գործունեություն)",
    council: "Դասավորություն՝ խորհրդի քարտեր (լուսանկար, անուն, պաշտոն, տեքստ)",
    executive: "Դասավորություն՝ գործադիր մարմնի քարտեր",
  };

  var FORM_TYPE_LABEL = {
    membership_org: "Անդամակցություն · կազմակերպություն",
    membership_individual: "Անդամակցություն · ֆիզ. անձ",
    contact: "Հետադարձ կապ",
  };

  function escapeHtml(t) {
    var d = document.createElement("div");
    d.textContent = t == null ? "" : String(t);
    return d.innerHTML;
  }

  /** Դիմումները ներգրավվում են /api/admin/site-ի մեջ (նույն հարցումը, ինչ գլխավորի համար) */
  function loadFormSubmissions() {
    return api("/api/admin/site")
      .then(parseApiJson)
      .then(function (data) {
        var subs = data && data.formSubmissions;
        return { submissions: Array.isArray(subs) ? subs : [] };
      });
  }

  function renderFormSubmissions(payload) {
    var el = $("forms-list");
    if (!el) return;
    var items = (payload && payload.submissions) || [];
    el.innerHTML = "";
    if (!items.length) {
      el.innerHTML = '<p class="upload-list">Դիմումներ դեռ չկան։</p>';
      return;
    }
    items.forEach(function (s) {
      var card = document.createElement("div");
      card.className = "card form-entry" + (s.read ? " form-entry--read" : "");
      var head = document.createElement("div");
      head.className = "row form-entry-head";
      head.style.cssText = "justify-content:space-between;flex-wrap:wrap;gap:8px;align-items:center;";
      var left = document.createElement("div");
      var typeLab = FORM_TYPE_LABEL[s.type] || s.type;
      left.innerHTML =
        "<strong>" +
        escapeHtml(typeLab) +
        "</strong> · " +
        escapeHtml(s.lang || "") +
        " · <code>" +
        escapeHtml((s.createdAt || "").slice(0, 19).replace("T", " ")) +
        "</code>" +
        (s.page ? " · " + escapeHtml(s.page) : "");
      var actions = document.createElement("div");
      actions.className = "row";
      actions.style.gap = "8px";
      var btnRead = document.createElement("button");
      btnRead.type = "button";
      btnRead.className = "secondary";
      btnRead.textContent = s.read ? "Չկարդացված" : "Կարդացված";
      btnRead.addEventListener("click", function () {
        api("/api/admin/form-submissions/" + encodeURIComponent(s.id), {
          method: "PATCH",
          body: JSON.stringify({ read: !s.read }),
        })
          .then(function () {
            return loadFormSubmissions();
          })
          .then(renderFormSubmissions)
          .catch(function () {
            alert("Սխալ");
          });
      });
      var btnDel = document.createElement("button");
      btnDel.type = "button";
      btnDel.className = "danger";
      btnDel.textContent = "Ջնջել";
      btnDel.addEventListener("click", function () {
        if (!confirm("Ջնջե՞լ այս գրառումը։")) return;
        api("/api/admin/form-submissions/" + encodeURIComponent(s.id), { method: "DELETE" })
          .then(function () {
            return loadFormSubmissions();
          })
          .then(renderFormSubmissions)
          .catch(function () {
            alert("Սխալ");
          });
      });
      actions.appendChild(btnRead);
      actions.appendChild(btnDel);
      head.appendChild(left);
      head.appendChild(actions);
      card.appendChild(head);

      var dl = document.createElement("dl");
      dl.className = "form-fields-dl";
      var f = s.fields || {};
      Object.keys(f).forEach(function (k) {
        var dt = document.createElement("dt");
        dt.textContent = k;
        var dd = document.createElement("dd");
        dd.textContent = f[k];
        dl.appendChild(dt);
        dl.appendChild(dd);
      });
      card.appendChild(dl);
      el.appendChild(card);
    });
  }

  function api(path, opts) {
    opts = opts || {};
    var headers = Object.assign({ Accept: "application/json" }, opts.headers || {});
    if (opts.body && typeof opts.body === "string") headers["Content-Type"] = "application/json";
    return fetch(API + path, Object.assign({}, opts, { credentials: "include", headers: headers })).then(function (r) {
      if (r.status === 401) {
        showLogin();
        throw new Error("401");
      }
      return r;
    });
  }

  function showLogin() {
    $("app").classList.add("hidden");
    $("login-screen").classList.remove("hidden");
  }

  function showApp() {
    $("login-screen").classList.add("hidden");
    $("app").classList.remove("hidden");
  }

  function loadSite() {
    return api("/api/admin/site").then(function (r) {
      return r.json();
    });
  }

  function saveSite() {
    return api("/api/admin/site", { method: "PUT", body: JSON.stringify(state) }).then(function (r) {
      return r.json();
    });
  }

  function formToHome() {
    var h = state.home;
    h.heroImages = $("hero-images")
      .value.split("\n")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);

    ["am", "en", "ru"].forEach(function (lang) {
      h.hero[lang] = h.hero[lang] || {};
      h.hero[lang].text = $("hero-" + lang + "-text").value;
      h.hero[lang].ctaText = $("hero-" + lang + "-cta").value;
      h.hero[lang].ctaHref = $("hero-" + lang + "-href").value;
    });

    ["am", "en", "ru"].forEach(function (lang) {
      h.about[lang] = h.about[lang] || {};
      h.about[lang].title = $("about-" + lang + "-title").value;
      h.about[lang].bodyHtml = $("about-" + lang + "-body").value;
      h.about[lang].buttonText = $("about-" + lang + "-bt").value;
      h.about[lang].buttonHref = $("about-" + lang + "-bh").value;
    });

    h.newsSection.am = {
      title: $("ns-am-t").value,
      viewAllText: $("ns-am-v").value,
      viewAllHref: $("ns-am-h").value,
    };
    h.newsSection.en = {
      title: $("ns-en-t").value,
      viewAllText: $("ns-en-v").value,
      viewAllHref: $("ns-en-h").value,
    };
    h.newsSection.ru = {
      title: $("ns-ru-t").value,
      viewAllText: $("ns-ru-v").value,
      viewAllHref: $("ns-ru-h").value,
    };

    try {
      h.membership = JSON.parse($("membership-json").value);
    } catch (e) {
      alert("JSON սխալ «Անդամակցության առավելություններ» դաշտում");
      throw e;
    }
    try {
      h.stats = JSON.parse($("stats-json").value);
    } catch (e) {
      alert("JSON սխալ «Վիճակագրություն» դաշտում");
      throw e;
    }
  }

  function homeToForm() {
    var h = state.home;
    $("hero-images").value = (h.heroImages || []).join("\n");

    ["am", "en", "ru"].forEach(function (lang) {
      var x = h.hero[lang] || {};
      $("hero-" + lang + "-text").value = x.text || "";
      $("hero-" + lang + "-cta").value = x.ctaText || "";
      $("hero-" + lang + "-href").value = x.ctaHref || "";
    });

    ["am", "en", "ru"].forEach(function (lang) {
      var x = h.about[lang] || {};
      $("about-" + lang + "-title").value = x.title || "";
      $("about-" + lang + "-body").value = x.bodyHtml || "";
      $("about-" + lang + "-bt").value = x.buttonText || "";
      $("about-" + lang + "-bh").value = x.buttonHref || "";
    });

    var ns = h.newsSection || {};
    $("ns-am-t").value = (ns.am && ns.am.title) || "";
    $("ns-am-v").value = (ns.am && ns.am.viewAllText) || "";
    $("ns-am-h").value = (ns.am && ns.am.viewAllHref) || "";
    $("ns-en-t").value = (ns.en && ns.en.title) || "";
    $("ns-en-v").value = (ns.en && ns.en.viewAllText) || "";
    $("ns-en-h").value = (ns.en && ns.en.viewAllHref) || "";
    $("ns-ru-t").value = (ns.ru && ns.ru.title) || "";
    $("ns-ru-v").value = (ns.ru && ns.ru.viewAllText) || "";
    $("ns-ru-h").value = (ns.ru && ns.ru.viewAllHref) || "";

    $("membership-json").value = JSON.stringify(h.membership || {}, null, 2);
    $("stats-json").value = JSON.stringify(h.stats || {}, null, 2);
    $("full-json").value = JSON.stringify(state, null, 2);
  }

  function renderNewsEditor() {
    var el = $("news-editor");
    el.innerHTML = "";
    (state.news || []).forEach(function (n, idx) {
      var card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-id", n.id || "n-" + idx);
      card.innerHTML =
        '<div class="row" style="justify-content:space-between">' +
        "<strong>Նորություն #" +
        (idx + 1) +
        '</strong><button type="button" class="danger btn-del">Ջնջել</button></div>' +
        '<label><input type="checkbox" class="pub"> Հրապարակված</label>' +
        '<div class="grid-2">' +
        '<div><label>Ամսաթիվ</label><input type="text" class="dt" placeholder="28-02-2026"></div>' +
        '<div><label>Հղում (կայքի էջ)</label><input type="text" class="lk"></div>' +
        '<div><label>Նկար (URL)</label><input type="text" class="im"></div>' +
        '<div><label>Պիտակ</label><input type="text" class="tg"></div>' +
        "</div>" +
        '<label>Վերնագիր AM</label><input type="text" class="tam">' +
        '<label>Վերնագիր EN</label><input type="text" class="ten">' +
        '<label>Վերնագիր RU</label><input type="text" class="tru">' +
        '<label>Անոնս AM</label><textarea class="eam" rows="2"></textarea>' +
        '<label>Անոնս EN</label><textarea class="een" rows="2"></textarea>' +
        '<label>Անոնս RU</label><textarea class="eru" rows="2"></textarea>';

      el.appendChild(card);

      card.querySelector(".pub").checked = !!n.published;
      card.querySelector(".dt").value = n.date || "";
      card.querySelector(".lk").value = n.link || "";
      card.querySelector(".im").value = n.image || "";
      card.querySelector(".tg").value = n.tag || "";
      card.querySelector(".tam").value = (n.title && n.title.am) || "";
      card.querySelector(".ten").value = (n.title && n.title.en) || "";
      card.querySelector(".tru").value = (n.title && n.title.ru) || "";
      card.querySelector(".eam").value = (n.excerpt && n.excerpt.am) || "";
      card.querySelector(".een").value = (n.excerpt && n.excerpt.en) || "";
      card.querySelector(".eru").value = (n.excerpt && n.excerpt.ru) || "";

      card.querySelector(".btn-del").addEventListener("click", function () {
        var id = card.getAttribute("data-id");
        state.news = (state.news || []).filter(function (x) {
          return (x.id || "") !== id;
        });
        renderNewsEditor();
      });
    });
  }

  function newsFromForm() {
    var cards = $("news-editor").querySelectorAll(".card");
    var next = [];
    cards.forEach(function (card, idx) {
      var id = card.getAttribute("data-id") || "n" + uuid();
      next.push({
        id: id,
        published: card.querySelector(".pub").checked,
        date: card.querySelector(".dt").value,
        link: card.querySelector(".lk").value,
        image: card.querySelector(".im").value,
        tag: card.querySelector(".tg").value,
        title: {
          am: card.querySelector(".tam").value,
          en: card.querySelector(".ten").value,
          ru: card.querySelector(".tru").value,
        },
        excerpt: {
          am: card.querySelector(".eam").value,
          en: card.querySelector(".een").value,
          ru: card.querySelector(".eru").value,
        },
        sortOrder: idx,
      });
    });
    state.news = next;
  }

  function uuid() {
    return "xxxxxxxx".replace(/x/g, function () {
      return ((Math.random() * 16) | 0).toString(16);
    });
  }

  function ensurePageSlugSelect() {
    var sel = $("page-slug-select");
    var preferred =
      sel.value && PAGE_SLUGS.indexOf(sel.value) >= 0
        ? sel.value
        : sel.dataset.prevSlug && PAGE_SLUGS.indexOf(sel.dataset.prevSlug) >= 0
          ? sel.dataset.prevSlug
          : PAGE_SLUGS[0];
    sel.innerHTML = "";
    PAGE_SLUGS.forEach(function (slug) {
      var o = document.createElement("option");
      o.value = slug;
      o.textContent = PAGE_LABELS[slug] || slug;
      sel.appendChild(o);
    });
    sel.value = preferred;
    if (!sel.dataset.prevSlug) sel.dataset.prevSlug = sel.value;
  }

  function renderPageLayoutHint() {
    var slug = $("page-slug-select").value;
    var layout = (state.pagePosts && state.pagePosts[slug] && state.pagePosts[slug].layout) || "news";
    $("page-layout-hint").textContent = LAYOUT_HINTS[layout] || layout;
  }

  function renderPagePostsEditor() {
    ensurePageSlugSelect();
    var slug = $("page-slug-select").value;
    $("page-slug-select").dataset.prevSlug = slug;
    renderPageLayoutHint();
    var el = $("pages-editor");
    el.innerHTML = "";
    if (!state.pagePosts || !state.pagePosts[slug]) return;
    var posts = state.pagePosts[slug].posts || [];
    posts.forEach(function (n, idx) {
      var card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-id", n.id || "p-" + idx);
      card.innerHTML =
        '<div class="row" style="justify-content:space-between">' +
        "<strong>Գրառում #" +
        (idx + 1) +
        '</strong><button type="button" class="danger btn-del-page">Ջնջել</button></div>' +
        '<label><input type="checkbox" class="pub-p"> Հրապարակված</label>' +
        '<div class="grid-2">' +
        '<div><label>Ամսաթիվ</label><input type="text" class="dt-p" placeholder="28-02-2026"></div>' +
        '<div><label>Հղում</label><input type="text" class="lk-p"></div>' +
        '<div><label>Նկար (URL)</label><input type="text" class="im-p"></div>' +
        "</div>" +
        '<label>Վերնագիր / անուն (AM)</label><input type="text" class="tam-p">' +
        '<label>Վերնագիր EN</label><input type="text" class="ten-p">' +
        '<label>Վերնագիր RU</label><input type="text" class="tru-p">' +
        '<label>Պաշտոն / ենթավերնագիր (AM)</label><input type="text" class="sam-p">' +
        '<label>Պաշտոն EN</label><input type="text" class="sen-p">' +
        '<label>Պաշտոն RU</label><input type="text" class="sru-p">' +
        '<label>Տեքստ / անոնս (AM)</label><textarea class="eam-p" rows="2"></textarea>' +
        '<label>Տեքստ EN</label><textarea class="een-p" rows="2"></textarea>' +
        '<label>Տեքստ RU</label><textarea class="eru-p" rows="2"></textarea>';

      el.appendChild(card);

      card.querySelector(".pub-p").checked = !!n.published;
      card.querySelector(".dt-p").value = n.date || "";
      card.querySelector(".lk-p").value = n.link || "";
      card.querySelector(".im-p").value = n.image || "";
      card.querySelector(".tam-p").value = (n.title && n.title.am) || "";
      card.querySelector(".ten-p").value = (n.title && n.title.en) || "";
      card.querySelector(".tru-p").value = (n.title && n.title.ru) || "";
      card.querySelector(".sam-p").value = (n.subtitle && n.subtitle.am) || "";
      card.querySelector(".sen-p").value = (n.subtitle && n.subtitle.en) || "";
      card.querySelector(".sru-p").value = (n.subtitle && n.subtitle.ru) || "";
      card.querySelector(".eam-p").value = (n.excerpt && n.excerpt.am) || "";
      card.querySelector(".een-p").value = (n.excerpt && n.excerpt.en) || "";
      card.querySelector(".eru-p").value = (n.excerpt && n.excerpt.ru) || "";

      card.querySelector(".btn-del-page").addEventListener("click", function () {
        pagePostsFromFormFor(slug);
        var id = card.getAttribute("data-id");
        state.pagePosts[slug].posts = (state.pagePosts[slug].posts || []).filter(function (x) {
          return (x.id || "") !== id;
        });
        renderPagePostsEditor();
      });
    });
  }

  function pagePostsFromFormFor(slug) {
    if (!slug || !state.pagePosts || !state.pagePosts[slug]) return;
    var layout = state.pagePosts[slug].layout || "news";
    var cards = $("pages-editor").querySelectorAll(".card");
    var next = [];
    cards.forEach(function (card, idx) {
      var id = card.getAttribute("data-id") || "p" + uuid();
      next.push({
        id: id,
        published: card.querySelector(".pub-p").checked,
        date: card.querySelector(".dt-p").value,
        link: card.querySelector(".lk-p").value,
        image: card.querySelector(".im-p").value,
        title: {
          am: card.querySelector(".tam-p").value,
          en: card.querySelector(".ten-p").value,
          ru: card.querySelector(".tru-p").value,
        },
        subtitle: {
          am: card.querySelector(".sam-p").value,
          en: card.querySelector(".sen-p").value,
          ru: card.querySelector(".sru-p").value,
        },
        excerpt: {
          am: card.querySelector(".eam-p").value,
          en: card.querySelector(".een-p").value,
          ru: card.querySelector(".eru-p").value,
        },
        sortOrder: idx,
      });
    });
    state.pagePosts[slug] = { layout: layout, posts: next };
  }

  function refreshAll() {
    homeToForm();
    renderNewsEditor();
    renderPagePostsEditor();
  }

  $("btn-login").addEventListener("click", function () {
    $("login-err").classList.add("hidden");
    api("/api/admin/login", { method: "POST", body: JSON.stringify({ password: $("pw").value }) })
      .then(function (r) {
        if (!r.ok) throw new Error("bad");
        return r.json();
      })
      .then(function () {
        return loadSite();
      })
      .then(function (data) {
        state = data;
        showApp();
        refreshAll();
      })
      .catch(function () {
        $("login-err").textContent = "Սխալ գաղտնաբառ";
        $("login-err").classList.remove("hidden");
      });
  });

  $("btn-logout").addEventListener("click", function () {
    api("/api/admin/logout", { method: "POST", body: "{}" }).finally(function () {
      showLogin();
    });
  });

  $("btn-reload").addEventListener("click", function () {
    loadSite().then(function (data) {
      state = data;
      refreshAll();
    });
  });

  $("btn-save-home").addEventListener("click", function () {
    $("save-msg-home").textContent = "Պահպանում…";
    try {
      formToHome();
    } catch (e) {
      return;
    }
    saveSite()
      .then(function (data) {
        state = data;
        $("save-msg-home").textContent = "Պահպանված ✓";
        $("full-json").value = JSON.stringify(state, null, 2);
        setTimeout(function () {
          $("save-msg-home").textContent = "";
        }, 2500);
      })
      .catch(function () {
        $("save-msg-home").textContent = "Սխալ";
      });
  });

  $("btn-save-news").addEventListener("click", function () {
    $("save-msg-news").textContent = "Պահպանում…";
    newsFromForm();
    saveSite()
      .then(function (data) {
        state = data;
        $("save-msg-news").textContent = "Պահպանված ✓";
        $("full-json").value = JSON.stringify(state, null, 2);
        renderNewsEditor();
        setTimeout(function () {
          $("save-msg-news").textContent = "";
        }, 2500);
      })
      .catch(function () {
        $("save-msg-news").textContent = "Սխալ";
      });
  });

  $("btn-add-news").addEventListener("click", function () {
    newsFromForm();
    state.news.push({
      id: "n" + Date.now(),
      published: true,
      sortOrder: state.news.length,
      date: "",
      link: "norutyunner.html",
      image: "public/logo.jpg",
      tag: "ՀՖԱ",
      title: { am: "", en: "", ru: "" },
      excerpt: { am: "", en: "", ru: "" },
    });
    renderNewsEditor();
  });

  $("page-slug-select").addEventListener("change", function () {
    var sel = $("page-slug-select");
    var prev = sel.dataset.prevSlug;
    if (prev && prev !== sel.value) pagePostsFromFormFor(prev);
    sel.dataset.prevSlug = sel.value;
    renderPageLayoutHint();
    renderPagePostsEditor();
  });

  $("btn-save-pages").addEventListener("click", function () {
    $("save-msg-pages").textContent = "Պահպանում…";
    var slug = $("page-slug-select").value;
    pagePostsFromFormFor(slug);
    saveSite()
      .then(function (data) {
        state = data;
        $("save-msg-pages").textContent = "Պահպանված ✓";
        $("full-json").value = JSON.stringify(state, null, 2);
        renderPagePostsEditor();
        setTimeout(function () {
          $("save-msg-pages").textContent = "";
        }, 2500);
      })
      .catch(function () {
        $("save-msg-pages").textContent = "Սխալ";
      });
  });

  $("btn-add-page-post").addEventListener("click", function () {
    var slug = $("page-slug-select").value;
    pagePostsFromFormFor(slug);
    if (!state.pagePosts[slug]) state.pagePosts[slug] = { layout: "news", posts: [] };
    var layout = state.pagePosts[slug].layout || "news";
    state.pagePosts[slug].posts.push({
      id: "pp" + Date.now(),
      published: true,
      sortOrder: state.pagePosts[slug].posts.length,
      date: "",
      link: "#",
      image: "public/logo.jpg",
      title: { am: "", en: "", ru: "" },
      subtitle: { am: "", en: "", ru: "" },
      excerpt: { am: "", en: "", ru: "" },
    });
    state.pagePosts[slug].layout = layout;
    renderPagePostsEditor();
  });

  $("btn-save-json").addEventListener("click", function () {
    $("save-msg-json").textContent = "…";
    try {
      state = JSON.parse($("full-json").value);
    } catch (e) {
      $("save-msg-json").textContent = "Սխալ JSON";
      return;
    }
    saveSite()
      .then(function (data) {
        state = data;
        refreshAll();
        $("save-msg-json").textContent = "Պահպանված ✓";
      })
      .catch(function () {
        $("save-msg-json").textContent = "Սխալ";
      });
  });

  $("file-up").addEventListener("change", function () {
    var f = $("file-up").files[0];
    if (!f) return;
    var fd = new FormData();
    fd.append("file", f);
    api("/api/admin/upload", { method: "POST", body: fd, headers: {} })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        var box = $("upload-result");
        box.classList.remove("hidden");
        var full = window.location.origin + data.url;
        box.innerHTML =
          "<p>Պատճենեք URL-ը՝</p><p><code>" +
          data.url +
          "</code></p><p>Լիարժեք՝ <code>" +
          full +
          "</code></p>";
      })
      .catch(function () {
        alert("Բեռնման սխալ (պահանջվում է մուտք կամ չաջակցվող ֆայլի տեսակ)");
      });
    $("file-up").value = "";
  });

  document.querySelectorAll(".tab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      ["home", "news", "pages", "forms", "media", "json"].forEach(function (t) {
        $("tab-" + t).classList.toggle("hidden", btn.getAttribute("data-tab") !== t);
      });
      if (btn.getAttribute("data-tab") === "pages") {
        renderPagePostsEditor();
      }
      if (btn.getAttribute("data-tab") === "forms") {
        loadFormSubmissions()
          .then(renderFormSubmissions)
          .catch(function (err) {
            var m = err && err.message ? String(err.message) : "";
            alert(
              "Դիմումների բեռնման սխալ" +
                (m ? "\n\n" + m : "") +
                "\n\nՀուշում՝ բացեք ադմինը CMS սերվերից՝ օր. http://localhost:3847/admin/ (կամ index.html-ում նշեք window.CMS_ADMIN_API):"
            );
          });
      }
    });
  });

  $("btn-reload-forms").addEventListener("click", function () {
    loadFormSubmissions()
      .then(renderFormSubmissions)
      .catch(function (err) {
        var m = err && err.message ? String(err.message) : "";
        alert("Դիմումների բեռնման սխալ" + (m ? "\n\n" + m : ""));
      });
  });

  api("/api/admin/me")
    .then(function (r) {
      return r.json();
    })
    .then(function (d) {
      if (d.admin) {
        return loadSite().then(function (data) {
          state = data;
          showApp();
          refreshAll();
        });
      }
      showLogin();
    })
    .catch(showLogin);
})();
