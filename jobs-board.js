/**
 * Mediator job board — filters, cards, apply modal.
 * Set window.JOBS_API_BASE = 'https://api.example.com' when backend is ready.
 * GET  /jobs?category=&experience=&employment_type=&search=
 * POST /jobs/:id/apply  (multipart: first_name, last_name, phone, email, cv_file, message)
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var lang = (root.getAttribute("lang") || "am").toLowerCase();
  if (lang.length > 2) lang = lang.slice(0, 2);
  if (lang !== "en" && lang !== "ru") lang = "am";

  var API_BASE = (typeof window.JOBS_API_BASE === "string" ? window.JOBS_API_BASE : "").replace(/\/$/, "");

  var STRINGS = {
    am: {
      filterCategory: "Կատեգորիա",
      filterExperience: "Փորձ",
      filterEmployment: "Աշխատանքի ձևը",
      filterSearch: "Որոնում",
      all: "Բոլորը",
      cat_finance: "Ֆինանսներ",
      cat_it: "ՏՏ / թվային",
      cat_legal: "Իրավական",
      cat_operations: "Օպերացիաներ",
      cat_comms: "Հաղորդակցություն",
      exp_junior: "Սկսնակ",
      exp_mid: "Միջին",
      exp_senior: "Ավագ",
      emp_remote: "Հեռավար",
      emp_onsite: "Գրասենյակում",
      emp_hybrid: "Հիբրիդ",
      metaCategory: "Կատեգորիա",
      metaExperience: "Փորձ",
      metaEmployment: "Ձև",
      applyBtn: "Դիմել ասոցիացիայի միջոցով",
      loading: "Բեռնում…",
      empty: "Համապատասխան հնարավորություններ չկան։",
      modalTitle: "Դիմում",
      modalHint: "Դիմումը ուղարկվում է ասոցիացիայի միջոցով։ Գործատուի անունը չի ցուցադրվում։",
      firstName: "Անուն",
      lastName: "Ազգանուն",
      phone: "Հեռախոս",
      email: "Էլ. փոստ",
      cv: "CV (PDF, DOC, DOCX)",
      message: "Հաղորդագրություն (ըստ ցանկության)",
      submit: "Ուղարկել",
      cancel: "Փակել",
      successTitle: "Ձեր դիմումը ընդունվել է։",
      successBody:
        "Ասոցիացիան կկապվի ձեզ հետ համապատասխանության դեպքում։",
      errRequired: "Դաշտը պարտադիր է",
      errEmail: "Մուտքագրեք վավեր էլ. փոստ",
      errPhone: "Հեռախոսը պետք է սկսվի +374-ով",
      errCvType: "Թույլատրվում են միայն PDF, DOC կամ DOCX",
      submitting: "Ուղարկում…",
    },
    en: {
      filterCategory: "Category",
      filterExperience: "Experience",
      filterEmployment: "Employment type",
      filterSearch: "Search",
      all: "All",
      cat_finance: "Finance",
      cat_it: "IT / Digital",
      cat_legal: "Legal",
      cat_operations: "Operations",
      cat_comms: "Communications",
      exp_junior: "Junior",
      exp_mid: "Mid-level",
      exp_senior: "Senior",
      emp_remote: "Remote",
      emp_onsite: "On-site",
      emp_hybrid: "Hybrid",
      metaCategory: "Category",
      metaExperience: "Experience",
      metaEmployment: "Type",
      applyBtn: "Apply through the association",
      loading: "Loading…",
      empty: "No matching opportunities.",
      modalTitle: "Application",
      modalHint: "Your application is sent via the association. Employer name is not shown.",
      firstName: "First name",
      lastName: "Last name",
      phone: "Phone",
      email: "Email",
      cv: "CV (PDF, DOC, DOCX)",
      message: "Message (optional)",
      submit: "Submit",
      cancel: "Close",
      successTitle: "Your application has been received.",
      successBody: "The association will contact you if there is a match.",
      errRequired: "This field is required",
      errEmail: "Enter a valid email",
      errPhone: "Phone must start with +374",
      errCvType: "Only PDF, DOC or DOCX allowed",
      submitting: "Sending…",
    },
    ru: {
      filterCategory: "Категория",
      filterExperience: "Опыт",
      filterEmployment: "Тип занятости",
      filterSearch: "Поиск",
      all: "Все",
      cat_finance: "Финансы",
      cat_it: "ИТ / цифровые",
      cat_legal: "Юриспруденция",
      cat_operations: "Операции",
      cat_comms: "Коммуникации",
      exp_junior: "Junior",
      exp_mid: "Middle",
      exp_senior: "Senior",
      metaCategory: "Категория",
      metaExperience: "Опыт",
      metaEmployment: "Формат",
      applyBtn: "Подать заявку через ассоциацию",
      loading: "Загрузка…",
      empty: "Подходящих вакансий нет.",
      modalTitle: "Заявка",
      modalHint: "Заявка отправляется через ассоциацию. Название работодателя не отображается.",
      firstName: "Имя",
      lastName: "Фамилия",
      phone: "Телефон",
      email: "Email",
      cv: "Резюме (PDF, DOC, DOCX)",
      message: "Сообщение (необязательно)",
      submit: "Отправить",
      cancel: "Закрыть",
      successTitle: "Ваша заявка принята.",
      successBody: "Ассоциация свяжется с вами при наличии соответствия.",
      errRequired: "Обязательное поле",
      errEmail: "Введите корректный email",
      errPhone: "Телефон должен начинаться с +374",
      errCvType: "Допустимы только PDF, DOC или DOCX",
      submitting: "Отправка…",
    },
  };

  var L = STRINGS[lang] || STRINGS.am;

  var CATEGORIES = ["finance", "it", "legal", "operations", "communications"];
  var EXPERIENCES = ["junior", "mid", "senior"];
  var EMPLOYMENT = ["remote", "onsite", "hybrid"];

  var DEMO_JOBS = [
    {
      id: "demo-1",
      category: "finance",
      experience: "mid",
      employment_type: "hybrid",
      title: {
        am: "Ֆինանսական վերլուծաբան",
        en: "Financial analyst",
        ru: "Финансовый аналитик",
      },
      description: {
        am: "Հաշվետվությունների պատրաստում, բյուջեի վերահսկում և գործընկեր կազմակերպության հետ համագործակցություն։ Աշխատանքը կազմակերպվում է ասոցիացիայի միջոցով։",
        en: "Reporting, budget monitoring and collaboration via the association. No direct contact with the employer.",
        ru: "Отчётность, контроль бюджета, взаимодействие через ассоциацию. Прямой контакт с работодателем не предусмотрен.",
      },
      salary_range: {
        am: "Աշխատավարձը՝ քննարկման",
        en: "Salary to be discussed",
        ru: "Зарплата по договорённости",
      },
      created_at: "2026-02-01",
    },
    {
      id: "demo-2",
      category: "it",
      experience: "senior",
      employment_type: "remote",
      title: {
        am: "Արտադրության անվտանգության մասնագետ",
        en: "Product security specialist",
        ru: "Специалист по безопасности продукта",
      },
      description: {
        am: "Թվային արտադրանքի անվտանգության գնահատում, խոցելիությունների վերլուծություն։ Հեռավար ռեժիմ, ամբողջական օր։",
        en: "Security assessments and vulnerability analysis for digital products. Full-time remote.",
        ru: "Оценка безопасности и анализ уязвимостей цифровых продуктов. Полная удалённая занятость.",
      },
      salary_range: null,
      created_at: "2026-02-10",
    },
    {
      id: "demo-3",
      category: "legal",
      experience: "mid",
      employment_type: "onsite",
      title: {
        am: "Իրավախորհրդատու",
        en: "Legal counsel",
        ru: "Юрисконсульт",
      },
      description: {
        am: "Պայմանագրերի վերանայում, համապատասխանություն կարգավորող պահանջներին։ Աշխատանքը գրասենյակում, Երևան։",
        en: "Contract review and regulatory compliance. On-site in Yerevan.",
        ru: "Договорная работа и комплаенс. Офис в Ереване.",
      },
      salary_range: {
        am: "Մրցակցային",
        en: "Competitive",
        ru: "Конкурентная",
      },
      created_at: "2026-02-18",
    },
    {
      id: "demo-4",
      category: "communications",
      experience: "junior",
      employment_type: "hybrid",
      title: {
        am: "Բովանդակության կոորդինատոր",
        en: "Content coordinator",
        ru: "Координатор контента",
      },
      description: {
        am: "Նյութերի պատրաստում, սոցիալական ցանցեր, միջոցառումների աջակցություն։ Սկսնակների համար հարմար թիմ։",
        en: "Content, social channels and event support. Junior-friendly team.",
        ru: "Контент, соцсети, поддержка мероприятий. Подходит для junior.",
      },
      salary_range: null,
      created_at: "2026-03-01",
    },
  ];

  function t(job, field) {
    var o = job[field];
    if (!o) return "";
    return o[lang] || o.am || o.en || "";
  }

  function labelCategory(key) {
    if (key === "communications") return L.cat_comms;
    return L["cat_" + key] || key;
  }
  function labelExperience(key) {
    return L["exp_" + key] || key;
  }
  function labelEmployment(key) {
    return L["emp_" + key] || key;
  }

  function matchesFilters(job, f) {
    if (f.category && job.category !== f.category) return false;
    if (f.experience && job.experience !== f.experience) return false;
    if (f.employment_type && job.employment_type !== f.employment_type) return false;
    if (f.search) {
      var q = f.search.toLowerCase();
      var blob = (t(job, "title") + " " + t(job, "description")).toLowerCase();
      if (blob.indexOf(q) === -1) return false;
    }
    return true;
  }

  function filterLocal(jobs, f) {
    return jobs.filter(function (j) {
      return matchesFilters(j, f);
    });
  }

  function buildQuery(f) {
    var p = new URLSearchParams();
    if (f.category) p.set("category", f.category);
    if (f.experience) p.set("experience", f.experience);
    if (f.employment_type) p.set("employment_type", f.employment_type);
    if (f.search) p.set("search", f.search);
    return p.toString();
  }

  async function fetchJobs(f) {
    if (!API_BASE) return filterLocal(DEMO_JOBS, f);
    try {
      var qs = buildQuery(f);
      var url = API_BASE + "/jobs" + (qs ? "?" + qs : "");
      var res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("bad status");
      var data = await res.json();
      var list = data.jobs || data.data || data;
      if (!Array.isArray(list)) throw new Error("shape");
      return list.map(normalizeJob).filter(Boolean);
    } catch (e) {
      return filterLocal(DEMO_JOBS, f);
    }
  }

  function normalizeJob(raw) {
    if (!raw || !raw.id) return null;
    return {
      id: String(raw.id),
      category: raw.category || "operations",
      experience: raw.experience || "mid",
      employment_type: raw.employment_type || "hybrid",
      title: typeof raw.title === "object" ? raw.title : { am: raw.title, en: raw.title, ru: raw.title },
      description:
        typeof raw.description === "object"
          ? raw.description
          : { am: raw.description, en: raw.description, ru: raw.description },
      salary_range: raw.salary_range
        ? typeof raw.salary_range === "object"
          ? raw.salary_range
          : { am: raw.salary_range, en: raw.salary_range, ru: raw.salary_range }
        : null,
      created_at: raw.created_at || "",
    };
  }

  function renderCard(job) {
    var el = document.createElement("article");
    el.className = "jobs-board-card";
    el.setAttribute("data-job-id", job.id);

    var salaryHtml = "";
    if (job.salary_range && t(job, "salary_range")) {
      salaryHtml = '<p class="jobs-board-card__salary">' + escapeHtml(t(job, "salary_range")) + "</p>";
    }

    el.innerHTML =
      "<h2 class=\"jobs-board-card__title\">" +
      escapeHtml(t(job, "title")) +
      "</h2>" +
      '<div class="jobs-board-card__meta">' +
      "<span>" +
      escapeHtml(L.metaCategory) +
      ": " +
      escapeHtml(labelCategory(job.category)) +
      "</span>" +
      "<span>" +
      escapeHtml(L.metaExperience) +
      ": " +
      escapeHtml(labelExperience(job.experience)) +
      "</span>" +
      "<span>" +
      escapeHtml(L.metaEmployment) +
      ": " +
      escapeHtml(labelEmployment(job.employment_type)) +
      "</span>" +
      "</div>" +
      '<p class="jobs-board-card__desc">' +
      escapeHtml(t(job, "description")) +
      "</p>" +
      salaryHtml +
      '<button type="button" class="jobs-board-btn jobs-board-btn--apply">' +
      escapeHtml(L.applyBtn) +
      "</button>";

    el.querySelector(".jobs-board-btn--apply").addEventListener("click", function () {
      openModal(job);
    });
    return el;
  }

  function escapeHtml(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var modalEl;
  var formEl;
  var currentJobId = null;

  function openModal(job) {
    currentJobId = job.id;
    modalEl.hidden = false;
    modalEl.querySelector(".jobs-modal__success").hidden = true;
    formEl.hidden = false;
    formEl.reset();
    clearFieldErrors();
    var st = modalEl.querySelector(".jobs-modal__subtitle");
    if (st) st.textContent = L.modalHint + " — " + t(job, "title");
    document.body.style.overflow = "hidden";
    var first = formEl.querySelector("input[name=first_name]");
    if (first) first.focus();
  }

  function closeModal() {
    modalEl.hidden = true;
    document.body.style.overflow = "";
    currentJobId = null;
    if (formEl) {
      formEl.hidden = false;
      formEl.reset();
      clearFieldErrors();
    }
    var succ = modalEl.querySelector(".jobs-modal__success");
    if (succ) succ.hidden = true;
  }

  function clearFieldErrors() {
    formEl.querySelectorAll(".field-error").forEach(function (n) {
      n.remove();
    });
    formEl.querySelectorAll(".jobs-input-err").forEach(function (n) {
      n.classList.remove("jobs-input-err");
      n.style.borderColor = "";
    });
  }

  function showError(inputName, msg) {
    var input = formEl.querySelector("[name='" + inputName + "']");
    if (!input) return;
    input.classList.add("jobs-input-err");
    input.style.borderColor = "#b00020";
    var err = document.createElement("div");
    err.className = "field-error";
    err.textContent = msg;
    input.parentNode.appendChild(err);
  }

  function validate(form) {
    clearFieldErrors();
    var ok = true;
    var fn = form.first_name.value.trim();
    var ln = form.last_name.value.trim();
    var phone = form.phone.value.trim();
    var email = form.email.value.trim();
    var cv = form.cv_file.files[0];

    if (!fn) {
      showError("first_name", L.errRequired);
      ok = false;
    }
    if (!ln) {
      showError("last_name", L.errRequired);
      ok = false;
    }
    if (!phone || phone.indexOf("+374") !== 0 || phone.replace(/\s/g, "").length < 12) {
      showError("phone", L.errPhone);
      ok = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("email", L.errEmail);
      ok = false;
    }
    if (!cv) {
      showError("cv_file", L.errRequired);
      ok = false;
    } else {
      var ext = cv.name.split(".").pop().toLowerCase();
      if (["pdf", "doc", "docx"].indexOf(ext) === -1) {
        showError("cv_file", L.errCvType);
        ok = false;
      }
    }
    return ok;
  }

  async function submitApply(e) {
    e.preventDefault();
    if (!validate(formEl)) return;

    var btn = formEl.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = L.submitting;

    var fd = new FormData(formEl);
    fd.set("first_name", formEl.first_name.value.trim());
    fd.set("last_name", formEl.last_name.value.trim());
    fd.set("phone", formEl.phone.value.trim());
    fd.set("email", formEl.email.value.trim());
    if (formEl.message) fd.set("message", formEl.message.value.trim());

    var success = false;
    if (API_BASE && currentJobId) {
      try {
        var res = await fetch(API_BASE + "/jobs/" + encodeURIComponent(currentJobId) + "/apply", {
          method: "POST",
          body: fd,
        });
        success = res.ok;
      } catch (err) {
        success = false;
      }
    } else {
      await new Promise(function (r) {
        setTimeout(r, 700);
      });
      success = true;
    }

    btn.disabled = false;
    btn.textContent = L.submit;

    if (success) {
      formEl.hidden = true;
      modalEl.querySelector(".jobs-modal__success").hidden = false;
    } else {
      alert(lang === "ru" ? "Ошибка отправки. Попробуйте позже." : lang === "en" ? "Send failed. Try again later." : "Ուղարկումը ձախողվեց։ Փորձեք ավելի ուշ։");
    }
  }

  function fillSelect(select, keys, labelFn, allLabel) {
    select.innerHTML = "";
    var o0 = document.createElement("option");
    o0.value = "";
    o0.textContent = allLabel;
    select.appendChild(o0);
    keys.forEach(function (k) {
      var o = document.createElement("option");
      o.value = k;
      o.textContent = labelFn(k);
      select.appendChild(o);
    });
  }

  function init() {
    var container = document.getElementById("jobs-board-root");
    if (!container) return;

    var loadingEl = document.getElementById("jobs-board-loading");
    var listEl = document.getElementById("jobs-board-list");
    var emptyEl = document.getElementById("jobs-board-empty");

    var cat = document.getElementById("jobs-filter-category");
    var exp = document.getElementById("jobs-filter-experience");
    var emp = document.getElementById("jobs-filter-employment");
    var search = document.getElementById("jobs-filter-search");

    if (cat) fillSelect(cat, CATEGORIES, labelCategory, L.all);
    if (exp) fillSelect(exp, EXPERIENCES, labelExperience, L.all);
    if (emp) fillSelect(emp, EMPLOYMENT, labelEmployment, L.all);

    document.getElementById("jobs-label-category").textContent = L.filterCategory;
    document.getElementById("jobs-label-experience").textContent = L.filterExperience;
    document.getElementById("jobs-label-employment").textContent = L.filterEmployment;
    document.getElementById("jobs-label-search").textContent = L.filterSearch;

    loadingEl.textContent = L.loading;
    emptyEl.textContent = L.empty;

    modalEl = document.getElementById("jobs-apply-modal");
    formEl = document.getElementById("jobs-apply-form");
    if (!modalEl || !formEl) return;

    document.getElementById("jobs-modal-title").textContent = L.modalTitle;
    document.getElementById("jobs-field-fn-label").textContent = L.firstName;
    document.getElementById("jobs-field-ln-label").textContent = L.lastName;
    document.getElementById("jobs-field-phone-label").textContent = L.phone;
    document.getElementById("jobs-field-email-label").textContent = L.email;
    document.getElementById("jobs-field-cv-label").textContent = L.cv;
    document.getElementById("jobs-field-msg-label").textContent = L.message;
    formEl.querySelector('button[type="submit"]').textContent = L.submit;
    document.getElementById("jobs-modal-close").setAttribute("aria-label", L.cancel);
    document.getElementById("jobs-success-line1").textContent = L.successTitle;
    document.getElementById("jobs-success-line2").textContent = L.successBody;

    modalEl.querySelector(".jobs-modal__close").addEventListener("click", closeModal);
    var successClose = document.getElementById("jobs-success-close");
    if (successClose) {
      successClose.textContent = L.cancel;
      successClose.addEventListener("click", closeModal);
    }
    modalEl.addEventListener("click", function (ev) {
      if (ev.target === modalEl) closeModal();
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && !modalEl.hidden) closeModal();
    });
    formEl.addEventListener("submit", submitApply);

    async function refresh() {
      loadingEl.classList.remove("hidden");
      listEl.innerHTML = "";
      var f = {
        category: cat.value,
        experience: exp.value,
        employment_type: emp.value,
        search: search.value.trim(),
      };
      var jobs = await fetchJobs(f);
      loadingEl.classList.add("hidden");
      if (!jobs.length) {
        emptyEl.classList.remove("hidden");
        return;
      }
      emptyEl.classList.add("hidden");
      jobs.forEach(function (job) {
        listEl.appendChild(renderCard(job));
      });
    }

    [cat, exp, emp].forEach(function (el) {
      if (el) el.addEventListener("change", refresh);
    });
    var searchTimer;
    search.addEventListener("input", function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(refresh, 280);
    });

    refresh();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
