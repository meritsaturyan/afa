"use strict";

const path = require("path");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const { readSite, writeSite, defaultSite, PAGE_SLUGS, mergePagePostsFromAdmin } = require("./store");

const PORT = Number(process.env.CMS_PORT || 3847);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";
const SESSION_SECRET = process.env.SESSION_SECRET || "afa-cms-dev-secret-change-me";
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const app = express();
app.disable("x-powered-by");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.use(
  session({
    name: "afa.cms.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.COOKIE_SECURE === "1",
    },
  })
);

const authFile = path.join(__dirname, "..", "data", "password.hash");

function ensureAuthFile() {
  if (!fs.existsSync(authFile)) {
    fs.mkdirSync(path.dirname(authFile), { recursive: true });
    fs.writeFileSync(authFile, bcrypt.hashSync(ADMIN_PASSWORD, 10), "utf8");
    console.warn("[CMS] Created data/password.hash — login with ADMIN_PASSWORD (default: changeme)");
  }
}

function getPasswordHash() {
  return fs.readFileSync(authFile, "utf8").trim();
}

function requireAuth(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.status(401).json({ error: "Unauthorized" });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "").slice(0, 8) || ".bin";
      cb(null, uuidv4() + ext.toLowerCase());
    },
  }),
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok =
      /^image\/(jpeg|pjpeg|png|gif|webp|svg\+xml)$/.test(file.mimetype) ||
      file.mimetype === "application/pdf";
    cb(null, ok);
  },
});

app.use("/uploads", express.static(UPLOAD_DIR));

const adminStatic = path.join(__dirname, "..", "..", "admin");
app.use("/admin", express.static(adminStatic));

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body || {};
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Password required" });
  }
  const hash = getPasswordHash();
  if (!bcrypt.compareSync(password, hash)) {
    return res.status(401).json({ error: "Invalid password" });
  }
  req.session.admin = true;
  res.json({ ok: true });
});

app.post("/api/admin/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/admin/me", (req, res) => {
  res.json({ admin: !!(req.session && req.session.admin) });
});

app.get("/api/admin/site", requireAuth, (_req, res) => {
  res.json(readSite());
});

app.put("/api/admin/site", requireAuth, (req, res) => {
  try {
    const incoming = req.body;
    if (!incoming || typeof incoming !== "object") return res.status(400).json({ error: "Invalid body" });
    const cur = readSite();
    const next = {
      version: (cur.version || 0) + 1,
      news: Array.isArray(incoming.news) ? incoming.news : cur.news,
      home: incoming.home && typeof incoming.home === "object" ? incoming.home : cur.home,
      pagePosts: mergePagePostsFromAdmin(cur, incoming.pagePosts),
    };
    writeSite(next);
    res.json(next);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Save failed" });
  }
});

app.post("/api/admin/upload", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename });
});

function publicHome(lang) {
  const site = readSite();
  const L = ["am", "en", "ru"].includes(lang) ? lang : "am";
  const news = (site.news || [])
    .filter((n) => n.published)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .slice(0, 6);

  return {
    lang: L,
    home: site.home,
    news,
  };
}

app.get("/api/public/home", (req, res) => {
  const lang = String(req.query.lang || "am").toLowerCase().slice(0, 2);
  res.json(publicHome(lang));
});

const PAGE_SLUG_SET = new Set(PAGE_SLUGS);

function pickLang(obj, lang) {
  if (!obj || typeof obj !== "object") return "";
  const L = ["am", "en", "ru"].includes(lang) ? lang : "am";
  const v = obj[L];
  if (v != null && String(v).trim() !== "") return String(v);
  if (obj.am != null && String(obj.am).trim() !== "") return String(obj.am);
  return "";
}

app.get("/api/public/page/:slug", (req, res) => {
  const slug = String(req.params.slug || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
  if (!PAGE_SLUG_SET.has(slug)) {
    return res.status(404).json({ error: "Unknown page" });
  }
  const lang = String(req.query.lang || "am").toLowerCase().slice(0, 2);
  const L = ["am", "en", "ru"].includes(lang) ? lang : "am";
  const site = readSite();
  const block = (site.pagePosts && site.pagePosts[slug]) || { layout: "news", posts: [] };
  const layout = block.layout || "news";
  const posts = (block.posts || [])
    .filter((p) => p.published)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((p) => ({
      id: p.id,
      date: p.date || "",
      link: p.link || "",
      image: p.image || "",
      title: pickLang(p.title, L),
      subtitle: pickLang(p.subtitle, L),
      excerpt: pickLang(p.excerpt, L),
    }));
  res.json({ lang: L, slug, layout, posts });
});

app.get("/cms-loader.js", (_req, res) => {
  const p = path.join(__dirname, "..", "..", "cms-loader.js");
  res.type("js").sendFile(p);
});

app.get("/cms-page-posts.js", (_req, res) => {
  const p = path.join(__dirname, "..", "..", "cms-page-posts.js");
  res.type("js").sendFile(p);
});

app.get("/cms-page-feed.css", (_req, res) => {
  const p = path.join(__dirname, "..", "..", "cms-page-feed.css");
  res.type("text/css").sendFile(p);
});

app.get("/", (_req, res) => {
  res.redirect("/admin/");
});

ensureAuthFile();

if (ADMIN_PASSWORD === "changeme" && !process.env.ADMIN_PASSWORD) {
  console.warn("[CMS] Default password: changeme");
}

const server = app.listen(PORT, () => {
  console.log(`AFA CMS running at http://localhost:${PORT}`);
  console.log(`Admin UI: http://localhost:${PORT}/admin/`);
  console.log(`Public API: http://localhost:${PORT}/api/public/home?lang=am`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`[CMS] Port ${PORT} is already in use (another CMS instance or app).`);
    console.error(`  • Stop the old process, or run on another port:`);
    console.error(`    CMS_PORT=3848 npm start`);
    console.error(`  • Then set the same URL in the site: window.CMS_ORIGIN = "http://localhost:3848"`);
    console.error(`  • Find PID: lsof -i :${PORT}  →  kill <PID>`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
