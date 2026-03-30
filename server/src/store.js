"use strict";

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "site.json");

const PAGE_SLUGS = [
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

const PAGE_LAYOUTS = {
  gorcuneutyun: "news",
  khorhurd: "council",
  gorcakir: "executive",
  handzhnajhoghovner: "news",
  ashxatatexer: "news",
  andamner: "news",
  mijotsaranner: "news",
  harotsaruytsner: "news",
  haytararutyunner: "news",
};

function emptyLangObj() {
  return { am: "", en: "", ru: "" };
}

function gorcuneutyunSeedPosts() {
  const rows = [
    ["public/advocacy.jpg", "Գործարար միջավայրի բարելավում և շահերի պաշտպանություն", "Business environment & advocacy", "Деловая среда и защита интересов"],
    ["public/social-dialogue.jpg", "Սոցիալական գործընկերություն", "Social partnership", "Социальное партнёрство"],
    ["public/business-consulting.jpg", "Սոցիալ-տնտեսական զարգացում և ֆորմալացում", "Socio-economic development", "Социально-экономическое развитие"],
    ["public/business-consulting.jpg", "ՓՄՁ և կանանց ձեռնարկատիրության զարգացում", "SME & women entrepreneurship", "МСП и женское предпринимательство"],
    ["public/legal-consulting.jpg", "Աշխատանքի անվտանգություն և առողջության պահպանում", "Occupational safety & health", "Охрана труда и здоровья"],
    ["public/business-coop.jpg", "Բիզնես համագործակցություն", "Business cooperation", "Бизнес-сотрудничество"],
    ["public/business-consulting.jpg", "Կանաչ տնտեսության զարգացում", "Green economy", "Зелёная экономика"],
    ["public/business-coop.jpg", "Արդյունաբերական զարգացում և արտահանման խթանում", "Industry & export promotion", "Промышленность и экспорт"],
    ["public/education-labour-market.jpg", "Կրթություն-աշխատաշուկա համագործակցություն և զբաղվածության խթանում", "Education–labour market & employment", "Образование, рынок труда и занятость"],
  ];
  return rows.map(([image, am, en, ru], i) => ({
    id: "gp" + (i + 1),
    published: true,
    sortOrder: i,
    date: "",
    link: "#",
    image,
    title: { am, en, ru },
    subtitle: emptyLangObj(),
    excerpt: emptyLangObj(),
  }));
}

function defaultPagePostsTemplate() {
  const o = {};
  PAGE_SLUGS.forEach((slug) => {
    o[slug] = { layout: PAGE_LAYOUTS[slug] || "news", posts: [] };
  });
  o.gorcuneutyun.posts = gorcuneutyunSeedPosts();
  return o;
}

function normalizeSite(site) {
  const base = defaultPagePostsTemplate();
  site.pagePosts = site.pagePosts && typeof site.pagePosts === "object" ? site.pagePosts : {};
  PAGE_SLUGS.forEach((slug) => {
    if (!site.pagePosts[slug] || typeof site.pagePosts[slug] !== "object") {
      site.pagePosts[slug] = JSON.parse(JSON.stringify(base[slug]));
      return;
    }
    const p = site.pagePosts[slug];
    const allowed = ["news", "council", "executive"];
    p.layout = allowed.includes(p.layout) ? p.layout : base[slug].layout;
    if (!Array.isArray(p.posts)) p.posts = [];
    p.posts.forEach((post) => {
      post.title = post.title && typeof post.title === "object" ? post.title : emptyLangObj();
      post.subtitle = post.subtitle && typeof post.subtitle === "object" ? post.subtitle : emptyLangObj();
      post.excerpt = post.excerpt && typeof post.excerpt === "object" ? post.excerpt : emptyLangObj();
      ["am", "en", "ru"].forEach((L) => {
        if (post.title[L] == null) post.title[L] = "";
        if (post.subtitle[L] == null) post.subtitle[L] = "";
        if (post.excerpt[L] == null) post.excerpt[L] = "";
      });
    });
  });
  return site;
}

function mergePagePostsFromAdmin(cur, incoming) {
  const merged = JSON.parse(JSON.stringify(cur));
  normalizeSite(merged);
  const out = merged.pagePosts;
  if (!incoming || typeof incoming !== "object") return out;
  PAGE_SLUGS.forEach((slug) => {
    if (incoming[slug] && typeof incoming[slug] === "object") {
      const allowed = ["news", "council", "executive"];
      const layout = String(incoming[slug].layout || out[slug].layout || "news");
      out[slug] = {
        layout: allowed.includes(layout) ? layout : out[slug].layout,
        posts: Array.isArray(incoming[slug].posts) ? incoming[slug].posts : out[slug].posts,
      };
    }
  });
  merged.pagePosts = out;
  return normalizeSite(merged).pagePosts;
}

function defaultSite() {
  return {
    version: 1,
    news: [
      {
        id: "n1",
        published: true,
        sortOrder: 0,
        date: "28-02-2026",
        link: "norutyunner_korporativ.html",
        image: "public/korporativ.jpg",
        tag: "ՀՖԱ",
        title: {
          am: "«Պրոֆեսիոնալ կորպորատիվ իրավաբանական սպասարկում» թեմայով սեմինար-քննարկում",
          en: "Seminar on professional corporate legal services",
          ru: "Семинар по корпоративному праву",
        },
        excerpt: {
          am: "28.02.2026թ.-ին Հայաստանի ֆինանսիստների ասոցիացիայում տեղի ունեցավ հերթական սեմինար-քննարկումը։",
          en: "On 28.02.2026 the Association held a seminar-discussion.",
          ru: "28.02.2026 состоялся семинар-обсуждение.",
        },
      },
      {
        id: "n2",
        published: true,
        sortOrder: 1,
        date: "28-02-2026",
        link: "norutyunner_scopus.html",
        image: "public/Scopus.jpg",
        tag: "ՀՖԱ",
        title: {
          am: "Ասոցիացիայի 2 անդամների գիտական հոդվածներ տպագրվել են Scopus վարկանիշավորվող գրքում",
          en: "Members' articles published in a Scopus-indexed book",
          ru: "Статьи членов ассоциации в книге Scopus",
        },
        excerpt: {
          am: "Ուրախությամբ տեղեկացնում ենք, որ ասոցիացիայի 2 անդամների հոդվածներ տպագրվել են Scopus գրքում։",
          en: "We are pleased to announce publications in an international Scopus-indexed book.",
          ru: "Рады сообщить о публикациях в книге Scopus.",
        },
      },
      {
        id: "n3",
        published: true,
        sortOrder: 2,
        date: "31-01-2026",
        link: "norutyunner_hamajoxov.html",
        image: "public/hamajoxov.jpg",
        tag: "ՀՖԱ",
        title: {
          am: "Հայաստանի ֆինանսիստների ասոցիացիայի Համաժողովը",
          en: "Conference of the Association of Accountants of Armenia",
          ru: "Конференция Ассоциации финансистов Армении",
        },
        excerpt: {
          am: "31.01.2026թ.-ին տեղի ունեցավ Համաժողովը։",
          en: "On 31.01.2026 the Conference took place.",
          ru: "31.01.2026 состоялась Конференция.",
        },
      },
    ],
    home: {
      heroImages: [
        "public/background.jpg",
        "public/hamajoxov.jpg",
        "public/korporativ.jpg",
        "public/hamajoxov5.jpg",
        "public/korporativ1.jpg",
      ],
      hero: {
        am: {
          text: "Մենք ներկայացնում ենք բիզնես համայնքի շահերը և խթանում բիզնեսի միջավայրի շարունակական բարելավումը:",
          ctaText: "Անդամակցել",
          ctaHref: "inchuandamakcel.html",
        },
        en: {
          text: "We represent the interests of the business community and promote a better business environment.",
          ctaText: "Join",
          ctaHref: "inchuandamakcel.html",
        },
        ru: {
          text: "Мы представляем интересы бизнес-сообщества и способствуем улучшению деловой среды.",
          ctaText: "Вступить",
          ctaHref: "inchuandamakcel.html",
        },
      },
      about: {
        am: {
          title: "ՄԵՐ ՄԱՍԻՆ",
          bodyHtml:
            "<p>Հայաստանի գործատուների հանրապետական միությունը (ՀՖԱ) շահույթ չհետապնդող, ոչ պետական կազմակերպություն է, որը ներկայացնում է գործատուների համընդհանուր շահերը Հայաստանում։</p>",
          buttonText: "ՏԵՍՆԵԼ ԱՎԵԼԻՆ",
          buttonHref: "mermasin.html",
        },
        en: {
          title: "ABOUT US",
          bodyHtml:
            "<p>The Association of Accountants of Armenia is a non-profit organisation representing employers' interests.</p>",
          buttonText: "READ MORE",
          buttonHref: "mermasin.html",
        },
        ru: {
          title: "О НАС",
          bodyHtml:
            "<p>Ассоциация финансистов Армении — некоммерческая организация, представляющая интересы работодателей.</p>",
          buttonText: "ПОДРОБНЕЕ",
          buttonHref: "mermasin.html",
        },
      },
      newsSection: {
        am: { title: "ՆՈՐՈՒԹՅՈՒՆՆԵՐ", viewAllText: "ՏԵՍՆԵԼ ԲՈԼՈՐԸ", viewAllHref: "norutyunner.html" },
        en: { title: "NEWS", viewAllText: "VIEW ALL", viewAllHref: "norutyunner.html" },
        ru: { title: "НОВОСТИ", viewAllText: "ВСЕ НОВОСТИ", viewAllHref: "norutyunner.html" },
      },
      membership: {
        title: {
          am: "ԱՆԴԱՄԱԿՑԵԼՈՒ ԱՌԱՎԵԼՈՒԹՅՈՒՆՆԵՐԸ",
          en: "MEMBERSHIP BENEFITS",
          ru: "ПРЕИМУЩЕСТВА ЧЛЕНСТВА",
        },
        items: [
          { image: "public/advocacy.jpg", title: { am: "Շահերի պաշտպանություն", en: "Advocacy", ru: "Защита интересов" }, text: { am: "Անդամների շահերի պաշտպանություն։", en: "Protection of members' interests.", ru: "Защита интересов членов." } },
          { image: "public/social-dialogue.jpg", title: { am: "Սոցիալական գործընկերություն", en: "Social dialogue", ru: "Социальный диалог" }, text: { am: "Օրենսդրական առաջարկներ։", en: "Legislative proposals.", ru: "Законодательные предложения." } },
          { image: "public/education-labour-market.jpg", title: { am: "Կրթություն-բիզնես", en: "Education–business", ru: "Образование и бизнес" }, text: { am: "Համագործակցություն կրթական հաստատությունների հետ։", en: "Cooperation with education.", ru: "Сотрудничество с вузами." } },
          { image: "public/business-consulting.jpg", title: { am: "Բիզնես խորհրդատվություն", en: "Business consulting", ru: "Бизнес-консалтинг" }, text: { am: "Բիզնես պլանավորում և թրեյնինգներ։", en: "Planning and training.", ru: "Планирование и обучение." } },
          { image: "public/business-coop.jpg", title: { am: "Բիզնես համագործակցություն", en: "Business cooperation", ru: "Бизнес-сотрудничество" }, text: { am: "Խթանում տեղական և արտասահմանյան կապերում։", en: "Local and international links.", ru: "Местные и международные связи." } },
          { image: "public/legal-consulting.jpg", title: { am: "Իրավաբանական խորհրդատվություն", en: "Legal consulting", ru: "Юридические консультации" }, text: { am: "Իրազեկում օրենսդրության վերաբերյալ։", en: "Legal awareness.", ru: "Правовая информация." } },
        ],
      },
      stats: {
        title: { am: "ՀՖԱ-Ն ԱՅՍՕՐ", en: "AFA TODAY", ru: "АФА СЕГОДНЯ" },
        introHtml: { am: "", en: "", ru: "" },
        items: [
          { value: "1411", type: { am: "ԱՆԴԱՄ ԿԱԶՄԱԿԵՐՊՈՒԹՅՈՒՆ", en: "MEMBER ORGANISATIONS", ru: "ОРГАНИЗАЦИЙ-ЧЛЕНОВ" }, text: { am: "ՀՖԱ միավորում է մոտ 1400 անդամ ընկերություններ։", en: "AFA unites about 1400 member companies.", ru: "АФА объединяет около 1400 компаний." } },
          { value: "18", type: { am: "ՏԱՐՎԱ ԳՈՐԾՈՒՆԵՈՒԹՅՈՒՆ", en: "YEARS OF ACTIVITY", ru: "ЛЕТ ДЕЯТЕЛЬНОСТИ" }, text: { am: "2007թ.-ից ՀՖԱ-ն ներկայացնում է գործատուների շահերը։", en: "Since 2007 AFA represents employers.", ru: "С 2007 года АФА представляет работодателей." } },
          { value: "22", type: { am: "ՃՅՈՒՂԱՅԻՆ ՄԻՈՒԹՅՈՒՆՆԵՐ", en: "SECTOR UNIONS", ru: "ОТРАСЛЕВЫХ ОБЪЕДИНЕНИЙ" }, text: { am: "Սերտ համագործակցություն ճյուղային միությունների հետ։", en: "Close cooperation with sector unions.", ru: "Тесное сотрудничество с отраслевыми объединениями." } },
        ],
      },
    },
    pagePosts: defaultPagePostsTemplate(),
  };
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultSite(), null, 2), "utf8");
  }
}

function readSite() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  let site;
  try {
    site = JSON.parse(raw);
  } catch {
    site = defaultSite();
  }
  return normalizeSite(site);
}

function writeSite(site) {
  ensureDataFile();
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(site, null, 2), "utf8");
  fs.renameSync(tmp, DATA_FILE);
  return site;
}

module.exports = {
  readSite,
  writeSite,
  defaultSite,
  DATA_FILE,
  PAGE_SLUGS,
  normalizeSite,
  mergePagePostsFromAdmin,
};
