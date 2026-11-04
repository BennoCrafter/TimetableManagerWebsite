// Generates the homepage in every other language (de/, fr/, es/ index.html) from index.html +
// translations/home.<lang>.json, so Google can index a real page per language.
// Run after editing either:  node scripts/build-langs.mjs   (tests/ fail if you forget)
//
// English is the markup of index.html. This bakes in what i18n.js would do at runtime for the language,
// using the same attributes: data-i18n (text), data-i18n-<attr> (attributes), data-src-<lang> (images;
// none = keep the English one). Shared header/footer keys (navGetApp, …) live in COMMON in i18n.js;
// those stay as they are and are translated at runtime. To add a language: add it to LANGS here and in
// i18n.js, write translations/home.<lang>.json, add its hreflang link to index.html and its URL to sitemap.xml.
import fs from "node:fs";
import { fileURLToPath } from "node:url";

export const LANGS = ["de", "fr", "es"];

const SITE = "https://www.timetablemanager.app";
const SOURCE = fileURLToPath(new URL("../index.html", import.meta.url));
const I18N_JS = fileURLToPath(new URL("../assets/js/i18n.js", import.meta.url));
const translations = (lang) => JSON.parse(fs.readFileSync(new URL(`../translations/home.${lang}.json`, import.meta.url), "utf8"));
const hasOgCard = (lang) => fs.existsSync(new URL(`../assets/images/og/${lang}/card.png`, import.meta.url));

const escapeText = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escapeAttr = (s) => escapeText(s).replace(/"/g, "&quot;");

function checkComplete(lang, html, dict, i18nJs) {
  const commonKeys = new Set([...i18nJs.matchAll(/^ {6}(\w+): "/gm)].map((m) => m[1]));
  const usedKeys = [...html.matchAll(/data-i18n(?:-\w+)?="(\w+)"/g)].map((m) => m[1]);
  const untranslated = [...new Set(usedKeys)].filter((key) => !(key in dict) && !commonKeys.has(key));
  if (untranslated.length) throw new Error(`translations/home.${lang}.json is missing: ${untranslated.join(", ")}`);
}

export function buildLang(
  lang,
  html,
  dict = translations(lang),
  i18nJs = fs.readFileSync(I18N_JS, "utf8"),
  ogCard = hasOgCard(lang),
) {
  checkComplete(lang, html, dict, i18nJs);

  // <html lang="en" data-url-de="de/index.html" …> → this language, pointing at English and the others from one folder down.
  const urls = ["en", ...LANGS].filter((l) => l !== lang)
    .map((l) => ` data-url-${l}="../${l === "en" ? "" : `${l}/`}index.html"`).join("");

  let out = html
    .replace(/<html lang="en"[^>]*>/, `<html lang="${lang}"${urls}>`)
    // One folder deeper: relative URLs need a ../ (absolute https:, #, mailto: etc. stay as they are)
    .replace(/(\s(?:href|src|data-src-\w+)=")(?![a-z]+:|[#/])/g, "$1../")
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${SITE}/${lang}/`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${SITE}/${lang}/`)
    .replace(/(<meta property="og:image" content="[^"]*\/)en\//, ogCard ? `$1${lang}/` : "$1en/")
    .replace(/\n *<!-- English homepage\.[\s\S]*?-->/, "");

  // Text content: <tag … data-i18n="key" …>text</tag>
  out = out.replace(/(<(\w+)\b[^>]*\sdata-i18n="(\w+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, open, tag, key, text, close) =>
    key in dict ? open + escapeText(dict[key]) + close : m,
  );

  // Attributes and localized images, tag by tag.
  out = out.replace(/<[a-z][^>]*>/g, (tag) => {
    for (const [, attr, key] of tag.matchAll(/data-i18n-(\w+)="(\w+)"/g)) {
      if (key in dict) tag = tag.replace(new RegExp(`(\\s${attr}=")[^"]*`), `$1${escapeAttr(dict[key])}`);
    }
    const src = tag.match(new RegExp(`data-src-${lang}="([^"]*)"`));
    if (src) tag = tag.replace(/(\ssrc=")[^"]*/, `$1${src[1]}`);
    return tag;
  });

  return out.replace("<!doctype html>\n", "<!doctype html>\n<!-- Generated from index.html by scripts/build-langs.mjs. Do not edit. -->\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const source = fs.readFileSync(SOURCE, "utf8");
  for (const lang of LANGS) {
    fs.mkdirSync(new URL(`../${lang}/`, import.meta.url), { recursive: true });
    fs.writeFileSync(new URL(`../${lang}/index.html`, import.meta.url), buildLang(lang, source));
    console.log(`wrote ${lang}/index.html`);
  }
}
