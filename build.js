"use strict";
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

child_process.exec("sass --no-source-map \\!custom-css.scss custom-css.css && cleancss -O2 --output custom-css.min.css custom-css.css", (error) => {

  if (error) {
    console.error(error);

  } else {
    const cssMin = fs.readFileSync(path.resolve(__dirname, "custom-css.min.css")).toString();

    const regexComment = /\/\*! IMPORT-START \*\/(.*?)\/\*! IMPORT-END \*\//g;

    const CSSImported = [];
    let CSSDirect = cssMin;

    let match;
    while ((match = regexComment.exec(cssMin)) !== null) {
      CSSImported.push(match[1].trim());
      CSSDirect = CSSDirect.replace(match[0], "");
    }

    fs.writeFileSync(path.resolve(__dirname, "custom-css-direct.min.css"), CSSDirect);
    fs.writeFileSync(path.resolve(__dirname, "custom-css-import.min.css"), CSSImported.join(""));

  }

});