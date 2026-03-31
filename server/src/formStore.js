"use strict";

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DATA_FILE = path.join(__dirname, "..", "data", "form-submissions.json");
const MAX_ITEMS = 2500;
const MAX_FIELD_LEN = 12000;
const MAX_KEYS = 40;

const FORM_TYPES = new Set(["membership_org", "membership_individual", "contact"]);

function readRaw() {
  if (!fs.existsSync(DATA_FILE)) return { submissions: [] };
  try {
    const j = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    return { submissions: Array.isArray(j.submissions) ? j.submissions : [] };
  } catch {
    return { submissions: [] };
  }
}

function writeRaw(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, DATA_FILE);
}

function sanitizeFields(obj) {
  if (!obj || typeof obj !== "object") return {};
  const out = {};
  let n = 0;
  for (const [k, v] of Object.entries(obj)) {
    if (n >= MAX_KEYS) break;
    const key = String(k)
      .replace(/[^\w.-]/g, "")
      .slice(0, 80);
    if (!key) continue;
    let s = v == null ? "" : String(v);
    if (s.length > MAX_FIELD_LEN) s = s.slice(0, MAX_FIELD_LEN);
    out[key] = s;
    n++;
  }
  return out;
}

function validateRequired(type, fields) {
  const f = fields;
  if (type === "membership_org") {
    const need = ["org_name", "contact_name", "phone", "email", "address", "activity", "message"];
    for (const k of need) {
      if (!String(f[k] || "").trim()) return `Missing: ${k}`;
    }
  } else if (type === "membership_individual") {
    const need = ["first_name", "last_name", "phone", "email", "profession", "purpose"];
    for (const k of need) {
      if (!String(f[k] || "").trim()) return `Missing: ${k}`;
    }
    if (String(f.purpose).length > 200) return "purpose too long";
  } else if (type === "contact") {
    if (!String(f.name || "").trim()) return "Missing: name";
    if (!String(f.email || "").trim()) return "Missing: email";
    if (!String(f.message || "").trim()) return "Missing: message";
  }
  return null;
}

function appendSubmission({ type, lang, page, fields, ip }) {
  const err = validateRequired(type, fields);
  if (err) {
    const e = new Error(err);
    e.code = "VALIDATION";
    throw e;
  }
  const data = readRaw();
  const entry = {
    id: uuidv4(),
    type,
    lang: ["am", "en", "ru"].includes(lang) ? lang : "am",
    page: String(page || "").slice(0, 300),
    createdAt: new Date().toISOString(),
    read: false,
    fields,
    ip: String(ip || "").slice(0, 80),
  };
  data.submissions.unshift(entry);
  if (data.submissions.length > MAX_ITEMS) data.submissions.length = MAX_ITEMS;
  writeRaw(data);
  return entry;
}

function listSubmissions() {
  return readRaw().submissions;
}

function deleteSubmission(id) {
  const data = readRaw();
  const before = data.submissions.length;
  data.submissions = data.submissions.filter((s) => s.id !== id);
  if (data.submissions.length === before) return false;
  writeRaw(data);
  return true;
}

function setRead(id, read) {
  const data = readRaw();
  const s = data.submissions.find((x) => x.id === id);
  if (!s) return false;
  s.read = !!read;
  writeRaw(data);
  return true;
}

module.exports = {
  FORM_TYPES,
  sanitizeFields,
  appendSubmission,
  listSubmissions,
  deleteSubmission,
  setRead,
  DATA_FILE,
};
