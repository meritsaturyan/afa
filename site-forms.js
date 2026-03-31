/**
 * Sends membership & contact forms to CMS API (POST /api/public/forms).
 * Set window.CMS_ORIGIN to your API base, e.g. "https://your-cms-host:3847"
 */
(function () {
  "use strict";

  function cmsOrigin() {
    var o = window.CMS_ORIGIN;
    if (o == null || o === "") return "";
    return String(o).replace(/\/$/, "");
  }

  function detectLang() {
    var p = (location.pathname || "").toLowerCase();
    if (p.indexOf("/en/") !== -1) return "en";
    if (p.indexOf("/ru/") !== -1) return "ru";
    return "am";
  }

  var THANKS = {
    am: "Շնորհակալություն։ Ձեր հայտը ընդունված է։",
    en: "Thank you. Your submission has been received.",
    ru: "Спасибо. Ваша заявка принята.",
  };

  function thanks() {
    return THANKS[detectLang()] || THANKS.am;
  }

  function postForm(type, fields) {
    var origin = cmsOrigin();
    if (!origin) {
      return Promise.reject(new Error("CMS_ORIGIN"));
    }
    return fetch(origin + "/api/public/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        type: type,
        lang: detectLang(),
        page: location.pathname || "",
        fields: fields,
      }),
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error((j && j.error) || r.status);
        return j;
      });
    });
  }

  function showErr(form, msg) {
    var el = form.querySelector(".form_api_error");
    if (!el) {
      el = document.createElement("p");
      el.className = "form_api_error";
      el.style.cssText = "color:#c00;margin:12px 0;font-size:14px;";
      form.insertBefore(el, form.firstChild);
    }
    el.textContent = msg || "";
    el.hidden = !msg;
  }

  function bindMembershipOrg(form) {
    form.addEventListener("submit", function (e) {
      if (!form.checkValidity()) return;
      e.preventDefault();
      showErr(form, "");
      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      var fd = new FormData(form);
      var fields = {};
      fd.forEach(function (v, k) {
        fields[k] = v;
      });
      postForm("membership_org", fields)
        .then(function () {
          alert(thanks());
          form.reset();
        })
        .catch(function (err) {
          showErr(
            form,
            err.message === "CMS_ORIGIN"
              ? "Կապը չի գտնվել (CMS_ORIGIN)։ Կապվեք ադմինիստրատորի հետ։"
              : "Ուղարկման սխալ։ " + (err.message || "")
          );
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  function bindContact(form) {
    form.addEventListener("submit", function (e) {
      if (!form.checkValidity()) return;
      e.preventDefault();
      showErr(form, "");
      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;
      var fd = new FormData(form);
      var fields = {};
      fd.forEach(function (v, k) {
        fields[k] = v;
      });
      postForm("contact", fields)
        .then(function () {
          alert(thanks());
          form.reset();
        })
        .catch(function (err) {
          showErr(
            form,
            err.message === "CMS_ORIGIN"
              ? "Կապը չի գտնվել (CMS_ORIGIN)։"
              : "Ուղարկման սխալ։ " + (err.message || "")
          );
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  function bindIndividual(form) {
    var successEl = document.getElementById("membership_success");
    var purpose = document.getElementById("purpose");
    var purposeCount = document.getElementById("purpose_count");

    function showFieldErr(id, msg) {
      var el = document.getElementById(id);
      if (!el) return;
      el.textContent = msg || "";
      el.hidden = !msg;
    }
    function clearErrs() {
      ["err_first_name", "err_last_name", "err_phone", "err_email", "err_profession", "err_purpose"].forEach(function (id) {
        showFieldErr(id, "");
      });
    }
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function updatePurposeCount() {
      if (purpose && purposeCount) {
        var n = purpose.value.length;
        purposeCount.textContent = "(մնացել է " + (200 - n) + " նիշ)";
      }
    }
    if (purpose) {
      purpose.addEventListener("input", updatePurposeCount);
      updatePurposeCount();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrs();
      showErr(form, "");
      var ok = true;
      var fn = (document.getElementById("first_name").value || "").trim();
      var ln = (document.getElementById("last_name").value || "").trim();
      var ph = (document.getElementById("phone").value || "").trim();
      var em = (document.getElementById("email").value || "").trim();
      var pr = (document.getElementById("profession").value || "").trim();
      var pu = (document.getElementById("purpose").value || "").trim();
      if (!fn) {
        showFieldErr("err_first_name", "Լրացրեք անունը");
        ok = false;
      }
      if (!ln) {
        showFieldErr("err_last_name", "Լրացրեք ազգանունը");
        ok = false;
      }
      if (!ph) {
        showFieldErr("err_phone", "Լրացրեք հեռախոսահամարը");
        ok = false;
      } else if (ph.indexOf("+374") !== 0) {
        showFieldErr("err_phone", "Հեռախոսը պետք է սկսվի +374");
        ok = false;
      }
      if (!em) {
        showFieldErr("err_email", "Լրացրեք էլ․ փոստը");
        ok = false;
      } else if (!emailRe.test(em)) {
        showFieldErr("err_email", "Ստուգեք էլ․ փոստի ձևաչափը");
        ok = false;
      }
      if (!pr) {
        showFieldErr("err_profession", "Լրացրեք մասնագիտությունը");
        ok = false;
      }
      if (!pu) {
        showFieldErr("err_purpose", "Լրացրեք նպատակը");
        ok = false;
      } else if (pu.length > 200) {
        showFieldErr("err_purpose", "Նիշերը չպետք է գերազանցեն 200-ը");
        ok = false;
      }
      if (!ok) return;

      var wp = (document.getElementById("workplace").value || "").trim();
      var pos = (document.getElementById("position").value || "").trim();
      var fields = {
        first_name: fn,
        last_name: ln,
        phone: ph,
        email: em,
        profession: pr,
        workplace: wp,
        position: pos,
        purpose: pu,
      };

      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = true;

      postForm("membership_individual", fields)
        .then(function () {
          form.style.display = "none";
          if (successEl) {
            successEl.hidden = false;
            successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } else {
            alert(thanks());
          }
        })
        .catch(function (err) {
          if (err.message === "CMS_ORIGIN") {
            try {
              var body =
                "Անուն: " +
                fn +
                "\nԱզգանուն: " +
                ln +
                "\nՀեռախոս: " +
                ph +
                "\nԷլ. փոստ: " +
                em +
                "\nՄասնագիտություն: " +
                pr +
                "\nԱշխատանքի վայր: " +
                (wp || "—") +
                "\nՊաշտոն: " +
                (pos || "—") +
                "\nՆպատակ:\n" +
                pu;
              var subj = encodeURIComponent("ՀՖԱ անդամակցության հայտ (ֆիզիկական անձ)");
              window.location.href = "mailto:armfinass@gmail.com?subject=" + subj + "&body=" + encodeURIComponent(body);
            } catch (x) {}
            form.style.display = "none";
            if (successEl) {
              successEl.hidden = false;
            }
          } else {
            showErr(form, "Ուղարկման սխալ։ " + (err.message || ""));
          }
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  function run() {
    var o = cmsOrigin();
    if (!o) {
      console.warn("[site-forms] Set window.CMS_ORIGIN to your CMS API URL (e.g. http://localhost:3847)");
    }

    var orgForm = document.querySelector("form.membership_form:not(#individual_membership_form)");
    if (orgForm) bindMembershipOrg(orgForm);

    var ind = document.getElementById("individual_membership_form");
    if (ind) bindIndividual(ind);

    var contact = document.querySelector("form.contact_form");
    if (contact) bindContact(contact);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
