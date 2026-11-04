// Site translation (LANGS below). Elements opt in with data-i18n="key" (text), data-i18n-<attribute>="key"
// (placeholder, alt, content); images swap source via data-src-<lang> (none for a language = English image). Strings shared by every page (header, footer)
// live in COMMON below; page-specific strings come from window.TRANSLATIONS defined inline in each page.
// Language priority: ?lang= query param, then saved choice, then browser language.
//
// Pages that exist once per language (the homepage: /, /de/, /fr/, /es/, see scripts/build-langs.mjs)
// are written in their language directly, so search engines can index each. They name their
// counterparts' URLs, e.g. <html lang="en" data-url-de="de/index.html" …>; on those pages the language
// menu navigates instead of translating in place. Load this in <head> so the redirect below happens
// before first paint.
(function () {
  var STORAGE_KEY = "tm-lang";
  var root = document.documentElement;

  // Code → name in its own language, as shown in the menu.
  var LANGS = { en: "English", de: "Deutsch", fr: "Français", es: "Español" };

  function known(lang) {
    return Object.prototype.hasOwnProperty.call(LANGS, lang);
  }

  function counterpartUrl(lang) {
    return root.getAttribute("data-url-" + lang);
  }
  var fixedLang = Object.keys(LANGS).some(counterpartUrl) ? root.lang : null;

  var COMMON = {
    en: {
      navGetApp: "Get on App Store",
      navBackHome: "Back to home",
      navKofi: "Support me on Ko-fi",
      footerTagline: "Timetable, homework, exams and grades in one app.",
      footerContact: "Contact Us",
      footerPrivacy: "Privacy Policy",
      footerImprint: "Imprint",
      footerFeedback: "Give Feedback",
      footerCopyright: "© 2027 Timetable Manager. All rights reserved.",
    },
    de: {
      navGetApp: "Laden im App Store",
      navBackHome: "Zurück zur Startseite",
      navKofi: "Unterstütze mich auf Ko-fi",
      footerTagline: "Stundenplan, Hausaufgaben, Prüfungen und Noten in einer App.",
      footerContact: "Kontakt",
      footerPrivacy: "Datenschutz",
      footerImprint: "Impressum",
      footerFeedback: "Feedback geben",
      footerCopyright: "© 2027 Timetable Manager. Alle Rechte vorbehalten.",
    },
    fr: {
      navGetApp: "Télécharger dans l'App Store",
      navBackHome: "Retour à l'accueil",
      navKofi: "Soutiens-moi sur Ko-fi",
      footerTagline: "Emploi du temps, devoirs, contrôles et notes dans une seule app.",
      footerContact: "Contact",
      footerPrivacy: "Confidentialité",
      footerImprint: "Mentions légales",
      footerFeedback: "Donner ton avis",
      footerCopyright: "© 2027 Timetable Manager. Tous droits réservés.",
    },
    es: {
      navGetApp: "Descargar en el App Store",
      navBackHome: "Volver al inicio",
      navKofi: "Apóyame en Ko-fi",
      footerTagline: "Horario, deberes, exámenes y notas en una sola app.",
      footerContact: "Contacto",
      footerPrivacy: "Privacidad",
      footerImprint: "Aviso legal",
      footerFeedback: "Enviar comentarios",
      footerCopyright: "© 2027 Timetable Manager. Todos los derechos reservados.",
    },
  };

  function detectLang() {
    var params = new URLSearchParams(window.location.search);
    var fromQuery = params.get("lang");
    if (known(fromQuery)) return fromQuery;

    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (known(stored)) return stored;
    } catch (e) {}

    var browser = (navigator.language || "").toLowerCase().slice(0, 2);
    return known(browser) ? browser : "en";
  }

  function apply(lang) {
    var page = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || {};
    var dict = Object.assign({}, COMMON[lang] || COMMON.en, page);

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    ["placeholder", "alt", "content"].forEach(function (attr) {
      document.querySelectorAll("[data-i18n-" + attr + "]").forEach(function (el) {
        var key = el.getAttribute("data-i18n-" + attr);
        if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
      });
    });

    document.querySelectorAll(".lang-switch select").forEach(function (select) {
      select.value = lang;
    });

    document.querySelectorAll("[data-src-en]").forEach(function (img) {
      img.src = img.getAttribute("data-src-" + lang) || img.getAttribute("data-src-en");
    });

    save(lang);
  }

  function save(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  // Visitors landing on the English homepage go to their language's version (/de/, …). Never redirect
  // the other way: crawlers browse in English and would never get to see the other versions.
  var wanted = detectLang();
  if (fixedLang === "en" && wanted !== "en" && counterpartUrl(wanted)) {
    location.replace(counterpartUrl(wanted) + location.hash);
    return;
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(fixedLang || detectLang());

    document.querySelectorAll(".lang-switch select").forEach(function (select) {
      select.innerHTML = Object.keys(LANGS)
        .map(function (code) {
          return '<option value="' + code + '" lang="' + code + '">' + LANGS[code] + "</option>";
        })
        .join("");
      select.value = document.documentElement.lang;
      select.addEventListener("change", function () {
        var lang = select.value;
        if (counterpartUrl(lang)) {
          save(lang);
          location.href = counterpartUrl(lang);
        } else {
          apply(lang);
        }
      });
    });
  });
})();
