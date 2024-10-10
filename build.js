"use strict";
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const crypto = require("crypto");

child_process.exec("sass --no-source-map styles.scss styles.css && cleancss -O2 --output styles.min.css styles.css", (error) => {

  if (error) {
    console.error(error);

  } else {
    const cssMin = fs.readFileSync(path.resolve(__dirname, "styles.min.css")).toString();

    const regexComment = /\/\*! IMPORT-START \*\/(.*?)\/\*! IMPORT-END \*\//g;

    const CSSImported = [];
    let CSSDirect = cssMin;

    let match;
    while ((match = regexComment.exec(cssMin)) !== null) {
      CSSImported.push(match[1].trim());
      CSSDirect = CSSDirect.replace(match[0], "");
    }

    let CSSImportedStr = CSSImported.join("");

    const hash = crypto.createHash("sha256");
    hash.update(CSSImportedStr);
    const hashFilename = hash.digest("hex").slice(0, 8);

    const distDir = path.resolve(__dirname, "dist/");

    fs.readdirSync(distDir).forEach(value => {
      fs.unlinkSync(path.resolve(distDir, value));
    });

    fs.writeFileSync(path.resolve(__dirname, "dist/styles-direct.min.css"),
      `@import url("https://cdn.jsdelivr.net/gh/nndda/itchio-profile@main/dist/${hashFilename}.css");` + CSSDirect);
    fs.writeFileSync(path.resolve(__dirname, `dist/${hashFilename}.css`), CSSImportedStr);

  }

});