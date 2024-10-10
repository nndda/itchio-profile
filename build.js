"use strict";
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

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

    fs.writeFileSync(path.resolve(__dirname, "dist/styles-direct.min.css"), CSSDirect);
    fs.writeFileSync(path.resolve(__dirname, "dist/styles-import.min.css"), CSSImported.join(""));

  }

});