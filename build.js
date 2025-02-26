const

  version = "1.2.0"
, githubRepo = "nndda/itchio-profile"
;

// ========================================================================================

const fs = require("fs");
const css = require("css");
const sass = require("sass");
const CleanCSS = require("clean-css");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const path = require("path");
const crypto = require("crypto");

const CDNImportTemplate = `@import url("https://cdn.jsdelivr.net/gh/${githubRepo}@${version}/dist/%s.css");`;
const maxCharLimit = 5120 - CDNImportTemplate.length - 64;

// Process CSS ============================================================================

// Compile & compress source stylesheet.
let rawCSS = cleanCSS(
  sass.compileString(
    fs.readFileSync(
      path.resolve(__dirname, "styles.scss")
    ).toString()
  ).css
);
postcss([
  autoprefixer({
    overrideBrowserslist: [
      "Electron 11.5.0",
      "since 2022",
    ]
  })
]).process(rawCSS, {from: undefined}).then(result => {
  result.warnings().forEach(warn => {
    console.warn(warn.toString());
  });
  rawCSS = result.css;
});

function getRuleCSSString(rule) {
  if (rule.type === "rule") {
      return `${
        rule.selectors.join(", ")
      } { ${
        rule.declarations.map(decl => `${decl.property}: ${decl.value};`).join(" ")
      } }`;

  } else if (rule.type === "media") {
      return `@media ${rule.media} { ${
        rule.rules.map(getRuleCSSString).join(" ")
      } }`;

  } else if (rule.type === "keyframes") {
      return `@keyframes ${rule.name} { ${
        rule.keyframes.map(keyframe => {
          return `${keyframe.values.join(", ")} { ${
            keyframe.declarations.map(decl => `${decl.property}: ${decl.value};`).join(" ")
          } }`;
        }).join(" ")

      } }`;

  }

  return "";
};

function cleanCSS(srcCSS) {
  let css = srcCSS;

  const cssCleaned = new CleanCSS({
    level: 2,
  }).minify(
    css
    .replace(/"\\\\/g, "\"\\")
    .replace("@charset \"UTF-8\";", "")
  );

  cssCleaned.errors.forEach(err => {
    console.error(err);
  });
  cssCleaned.warnings.forEach(warn => {
    console.warn(warn);
  });

  return cssCleaned.styles;
}

const arrCSS = css.parse(rawCSS).stylesheet.rules
  .map(rule => cleanCSS(getRuleCSSString(rule)))
  .filter(rule => "" !== rule);

  arrCSS.sort((a, b) => b.length - a.length);

let CSSMain = "";
let CSSImport = "";

for (let n = 0; n < arrCSS.length; n++) {
  const rule = arrCSS[n];

  if (CSSMain.length + rule.length <= maxCharLimit) {
    CSSMain += rule;
  } else {
    CSSImport = arrCSS.slice(n).join("");
    break;
  }
}

// File writing ===========================================================================

const hash = crypto.createHash("sha256");
hash.update(CSSImport);
const hashFilename = hash.digest("hex").slice(0, 8);

const distDir = path.resolve(__dirname, "dist/");

fs.readdirSync(distDir).forEach(value => {
  fs.unlinkSync(path.resolve(distDir, value));
});

fs.writeFileSync(path.resolve(__dirname, "dist/styles.css"),
  CDNImportTemplate.replace("%s", hashFilename) + CSSMain);
fs.writeFileSync(path.resolve(__dirname, `dist/${hashFilename}.css`), CSSImport);

console.log('CSS main:', (CDNImportTemplate.replace("%s", hashFilename) + CSSMain).length);
console.log('CSS imported:', CSSImport.length);