#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

const PAGES = [
  "gorcuneutyun.html",
  "khorhurd.html",
  "gorcakir.html",
  "handzhnajhoghovner.html",
  "ashxatatexer.html",
  "andamner.html",
  "mijotsaranner.html",
  "harotsaruytsner.html",
  "haytararutyunner.html",
];

const PREFIXES = ["", "en/", "ru/"];

const HANDZH_I18N = {
  hy: { title: "Հանձնաժողովներ", crumb: "Հանձնաժողովներ", home: "Գլխավոր", about: "Մեր մասին" },
  en: { title: "Committees", crumb: "Committees", home: "Home", about: "About us" },
  ru: { title: "Комитеты", crumb: "Комитеты", home: "Главная", about: "О нас" },
};

function injectAssets(html, rel) {
  if (html.includes("cms-page-posts.js")) return html;
  const inject = `
<link rel="stylesheet" href="${rel}cms-page-feed.css">
<script>window.CMS_ORIGIN = window.CMS_ORIGIN || "http://localhost:3847";</script>
<script src="${rel}cms-page-posts.js" defer></script>
`;
  const low = html.toLowerCase();
  const idx = low.indexOf("</body>");
  if (idx === -1) return html;
  return html.slice(0, idx) + inject + "\n" + html.slice(idx);
}

function patchGorcuneutyun(html) {
  return html.replace(
    /<div class="listing_inner">\s*\n\s*<div class="page_container">\s*\n\s*<ul class="news_list">[\s\S]*?<\/ul>/,
    `<div class="listing_inner cms-page-wrap">
            <div class="page_container">
                <ul class="news_list" data-cms-page="gorcuneutyun"></ul>`
  );
}

function patchCouncil(html, slug) {
  const re = new RegExp(
    `<div class="council_grid">\\s*((?:<div class="council_member_card">[\\s\\S]*?<\\/div>\\s*)+)<\\/div>`,
    "m"
  );
  return html.replace(re, `<div class="council_grid" data-cms-page="${slug}"></div>`);
}

function patchExecutive(html, slug) {
  const re = new RegExp(
    `<div class="executive_grid">\\s*((?:<div class="executive_member_card">[\\s\\S]*?<\\/div>\\s*)+)<\\/div>`,
    "m"
  );
  return html.replace(re, `<div class="executive_grid" data-cms-page="${slug}"></div>`);
}

function patchHandzh(html, locale) {
  const L = HANDZH_I18N[locale] || HANDZH_I18N.hy;
  const fix = `    <div class="content" style="min-height: 211px;">


        <div class="breadcrumbs">
            <div class="page_container">
                <ul>
                    <li><a href="index.html">${L.home}</a></li>
                    <li><a href="mermasin.html">${L.about}</a></li>
                    <li>
                        <div>${L.crumb}</div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="page_header_section">
            <div class="page_container">
                <h1 class="page_main_title">${L.title}</h1>
            </div>
        </div>

        <div class="listing_inner cms-page-wrap">
            <div class="page_container">
                <ul class="news_list" data-cms-page="handzhnajhoghovner"></ul>
            </div>
        </div>

    </div>

    <div class="footer" style="opacity: 1;">`;
  return html.replace(
    /    <div class="content" style="min-height: 211px;">[\s\S]*?<div class="footer" style="opacity: 1;">/,
    fix
  );
}

function patchAshxatatexer(html) {
  const needle = `        </div>

        <div class="inner_content_section">
            <div class="page_container">
                <div class="jobs-board-page" id="jobs-board-root">`;
  if (!html.includes(needle)) {
    console.warn("ashxatatexer: anchor not found");
    return html;
  }
  const insert = `        </div>

        <div class="listing_inner cms-page-wrap">
            <div class="page_container">
                <ul class="news_list" data-cms-page="ashxatatexer"></ul>
            </div>
        </div>

        <div class="inner_content_section">
            <div class="page_container">
                <div class="jobs-board-page" id="jobs-board-root">`;
  return html.replace(needle, insert);
}

function patchMembersList(html, slug) {
  const re = /<div class="members_list">\s*<div class="page_row">\s*<div class="standard_text">\s*[\s\S]*?\s*<\/div>\s*<\/div>\s*<\/div>/;
  const rep = `<div class="members_list">
                <div class="listing_inner cms-page-wrap">
                    <div class="page_container">
                        <ul class="news_list" data-cms-page="${slug}"></ul>
                    </div>
                </div>
            </div>`;
  return html.replace(re, rep);
}

function patchEventsList(html, slug) {
  const re = /<div class="events_list">\s*<div class="page_row">\s*<div class="standard_text">\s*[\s\S]*?\s*<\/div>\s*<\/div>\s*<\/div>/;
  const rep = `<div class="events_list">
                <div class="listing_inner cms-page-wrap">
                    <div class="page_container">
                        <ul class="news_list" data-cms-page="${slug}"></ul>
                    </div>
                </div>
            </div>`;
  return html.replace(re, rep);
}

function processFile(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) {
    console.warn("skip missing", relPath);
    return;
  }
  let html = fs.readFileSync(full, "utf8");
  const base = path.basename(relPath);
  const locale = relPath.startsWith("en/") ? "en" : relPath.startsWith("ru/") ? "ru" : "hy";
  const relAssets = locale === "hy" ? "" : "../";

  if (base === "gorcuneutyun.html") {
    html = patchGorcuneutyun(html);
  } else if (base === "khorhurd.html") {
    html = patchCouncil(html, "khorhurd");
  } else if (base === "gorcakir.html") {
    html = patchExecutive(html, "gorcakir");
  } else if (base === "handzhnajhoghovner.html") {
    html = patchHandzh(html, locale);
  } else if (base === "ashxatatexer.html") {
    html = patchAshxatatexer(html);
  } else if (base === "andamner.html") {
    html = patchMembersList(html, "andamner");
  } else if (base === "harotsaruytsner.html" || base === "haytararutyunner.html") {
    const slug = base.replace(".html", "");
    html = patchMembersList(html, slug);
  } else if (base === "mijotsaranner.html") {
    html = patchEventsList(html, "mijotsaranner");
  }

  html = injectAssets(html, relAssets);
  fs.writeFileSync(full, html, "utf8");
  console.log("patched", relPath);
}

function main() {
  for (const p of PREFIXES) {
    for (const name of PAGES) {
      processFile(p + name);
    }
  }
}

main();
