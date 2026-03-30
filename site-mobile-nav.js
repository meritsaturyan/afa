/**
 * Mobile / touch navigation: burger menu, submenus, search, closeAllMenues.
 * Vanilla JS — replaces broken truncated webpack bundles on many pages.
 */
(function () {
  "use strict";

  var MQ = "(max-width: 959px)";

  function isMobileNav() {
    try {
      return window.matchMedia(MQ).matches;
    } catch (e) {
      return window.innerWidth <= 959;
    }
  }

  function isIOS() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  }

  function setMenuOpen(open) {
    if (open) {
      document.body.classList.add("menu_opened");
      if (isIOS()) document.body.classList.add("ios_device");
    } else {
      document.body.classList.remove("menu_opened");
      document.body.classList.remove("ios_device");
    }
  }

  function closeSearch() {
    document.querySelectorAll(".header .search_block.opened").forEach(function (el) {
      el.classList.remove("opened");
    });
  }

  /** Called by legacy inline handlers; keeps compatibility */
  window.closeAllMenues = function (e) {
    if (e && e.target && e.target.closest && e.target.closest(".menu_btn")) return;
    setMenuOpen(false);
    closeSearch();
    document.querySelectorAll(".header .menu_list > li.hovered").forEach(function (li) {
      li.classList.remove("hovered");
    });
  };

  function initMenuButton() {
    var btn = document.querySelector(".header .menu_btn");
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = !document.body.classList.contains("menu_opened");
      setMenuOpen(open);
      if (!open) {
        document.querySelectorAll(".header .menu_list > li.hovered").forEach(function (li) {
          li.classList.remove("hovered");
        });
      }
    });
  }

  function initSubmenus() {
    document.querySelectorAll(".header .submenu_btn").forEach(function (sub) {
      sub.addEventListener("click", function (e) {
        if (!isMobileNav()) return;
        var li = sub.closest("li");
        if (!li || !li.querySelector(".submenu_list")) return;
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle("hovered");
        var parent = li.parentElement;
        if (parent) {
          [].forEach.call(parent.children, function (sib) {
            if (sib !== li) sib.classList.remove("hovered");
          });
        }
      });
    });
  }

  function initSearch() {
    var block = document.querySelector(".header .search_block");
    if (!block) return;
    var btn = block.querySelector("button[type=submit]");
    var input = block.querySelector("input");
    if (!btn || !input) return;
    btn.addEventListener("click", function (e) {
      if (block.getAttribute("data-type") !== "close") return;
      if (block.classList.contains("opened")) return;
      e.preventDefault();
      e.stopPropagation();
      block.classList.add("opened");
      try {
        input.focus();
      } catch (err) {}
    });
  }

  function initOutsideClose() {
    document.addEventListener("click", function (e) {
      if (!document.body.classList.contains("menu_opened")) return;
      var t = e.target;
      if (t.closest && (t.closest(".menu_block") || t.closest(".menu_btn"))) return;
      setMenuOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        closeSearch();
      }
    });
  }

  function init() {
    initMenuButton();
    initSubmenus();
    initSearch();
    initOutsideClose();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
