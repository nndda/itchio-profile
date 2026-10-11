import { minifyFragment } from "@swc/html";
import { readTxtFile, writeTxtFile } from "../util";
import { num2alph } from "./util";


export default async function (): Promise<string> {
  const
    htmlRaw = readTxtFile("src/content.html")

  , customClassMap: Record<string, string> = {}

  , rewritenHTML = (new HTMLRewriter())
    .on("[class*=\"custom\"]", {
      element(el) {
        const classes = el
          .getAttribute("class")
          ?.split(" ")
        ;

        if (classes) {
          for (const elClass of classes) {
            if (elClass.startsWith("custom")) {
              if (!(elClass in customClassMap)) {
                customClassMap[elClass] = num2alph(
                  Object.keys(customClassMap).length
                );
              }
            }
          }

          el.setAttribute("class",
            classes.map(elClass => {
              if (elClass.startsWith("custom")) {
                return "custom" + customClassMap[elClass];
              }

              return elClass;
            }).join(" "),
          );
        }
      },
    })
    .on("img", {
      element(img) {
        if (img.getAttribute("alt")?.trim() === "") {
          img.removeAttribute("alt");
        }

        if (img.getAttribute("loading")) {
          img.removeAttribute("loading");
        }
      },
    })
    .transform(htmlRaw)
  ;

  writeTxtFile("./custom-class-map.json", JSON.stringify(customClassMap));

  return (await minifyFragment(
    rewritenHTML,
    {
      mode: "no-quirks",
      removeEmptyAttributes: false,
      normalizeAttributes: true,
      tagOmission: false,
      removeRedundantAttributes: "none",
      removeComments: true,
      quotes: true,
      collapseWhitespaces: "all",
    },
  )).code;
};
