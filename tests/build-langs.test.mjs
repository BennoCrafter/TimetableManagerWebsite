// Run: node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { LANGS, buildLang } from "../scripts/build-langs.mjs";

for (const lang of LANGS) {
  test(`${lang}/index.html is up to date with index.html (run: node scripts/build-langs.mjs)`, () => {
    const source = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
    const generated = fs.readFileSync(new URL(`../${lang}/index.html`, import.meta.url), "utf8");
    assert.equal(generated, buildLang(lang, source));
  });
}
