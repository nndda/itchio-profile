import { simpleGit } from "simple-git";
import { col, prop, nano, whyDoesItchIoProfilePageHave5120CharacterCountLimitButOtherPagesDontIDontUnderstand } from "./optimize";
import { getCSSRulesArr } from "./optimize/util";
import html from "./optimize/html";
import cdnify from "./cdnify";
import { ghSlug, readTxtFile, writeTxtFile } from "./util";
import { getUrls, reJSDelivrMainURL } from "./urls";
import { chooseNonStale } from "./version";

type CSSTransforms = [ CSSVarTransform, string[] | undefined ];

( async (): Promise<void> => {

  const
    git = simpleGit()
  , repoUser = await ghSlug(git)
  , version = (await import("../../package.json")).default.version
  , CDNImportTemplate = `@import url("https://cdn.jsdelivr.net/gh/${repoUser}@${version}/dist/i.css");`

  , rawCSS = await nano(readTxtFile("./src/styles.css"), true)
  , rawHTML = await html()

  , urlsAssets = [...new Set(
      getUrls(rawCSS + rawHTML),
    )].filter(url => reJSDelivrMainURL.test(url))

  , urlAssetsVersionMapCached = JSON.parse(readTxtFile("./dist/assets-version.json")) as Record<string, string>
  , urlAssetsVersionMap: Record<string, string> = {}

  , urlAssetsFresh: string[] = []

  ;

  for (const urlMain of urlsAssets) {
    if (urlMain in urlAssetsVersionMapCached) {
      urlAssetsVersionMap[urlMain] = await chooseNonStale(urlAssetsVersionMapCached[urlMain], urlMain);
    } else {
      urlAssetsFresh.push(urlMain);
    }
  }

  console.log(`${urlsAssets.length} assets' URLs found: \n`, urlsAssets, "\n");

  if (urlAssetsFresh.length > 0) {
    console.log(`${urlAssetsFresh.length} new/changed assets found: \n`, urlAssetsFresh, "\n");
  }

  console.log("Assets version mapped to: ", urlAssetsVersionMap, "\n");

  let cssAll = "";

  console.log("Building HTML...\n");

  writeTxtFile("dist/content.html",
    cdnify(
      rawHTML,
      version,
      urlAssetsVersionMap,
    ),
  );

  console.log("Building CSS...\n");

  whyDoesItchIoProfilePageHave5120CharacterCountLimitButOtherPagesDontIDontUnderstand(

    ( await Promise.all(
      ( await getCSSRulesArr(
          ([

              [ col, [
                  "--primary",
                  "--icon-col",
                  "--text-col",
                ]
              ],
              [ prop, [ "--d" ] ],

          ] as CSSTransforms[])
            .reduce(
              ( prev, val ) => val[0](prev, val[1] || []),
              rawCSS,
            ),

          function(rule) {
            const
              selector = rule.selector
            , customClassMap = JSON.parse(readTxtFile("./custom-class-map.json"))
            ;

            if (selector.includes(".custom")) {
              console.log("\nSelector:", selector);

              let selectorNew = selector;

              Array
                .from(selector.matchAll(/\.(custom([\w|\-|_]+))/g))
                .sort( ( a, b ) =>  b[0].length - a[0].length )
                .forEach(res => {
                  const customClass = res[1];

                  if (customClass in customClassMap) {
                    selectorNew = selectorNew.replaceAll(res[0],
                      ".custom" +
                      customClassMap[customClass as keyof typeof customClassMap],
                    );
                  }
                })
              ;

              rule.selector = selectorNew;
              console.log("         ", selectorNew);
            }

            return rule;
          }
        )
      )
    ) ),

    5120 - 30 - CDNImportTemplate.length,

  ).forEach( async ( arr: string[], i: number ): Promise<void> => {

    const
      imported = i === 0
    , css = await nano(arr.join(""))
    ;

    cssAll += css;

    console.log(
      imported ? "\nCSS character count:\n" : "",
      ( imported ? "imported" : "main" ) + ":", css.length,
    );

    writeTxtFile(
      "dist/" +
      ( imported ? "i.css" : "styles.css" ),
      ( imported ? "" : CDNImportTemplate) +
      cdnify( css, version, urlAssetsVersionMap, ),
    );

    if (!imported) {
      console.log(" total:", cssAll.length);
      writeTxtFile("dist/test.css", cssAll);

      console.log(
`
+ ----------------------------------------------- +
|                                                 |
|  Build complete.                                |
|  Copy-paste the content of 'dist/test.css'      |
|  and 'dist/content.html'                        |
|  to the profile page first,                     |
|  to test it out.                                |
|                                                 |
+ ----------------------------------------------- +
|                                                 |
|  Run 'bun run publish' to push the updates.     |
|  And copy-paste the content of                  |
|  'dist/styles.css'                              |
|                                                 |
+ ----------------------------------------------- +
`
      );
    }
  });

  writeTxtFile(
    "dist/urls.txt",
    [...new Set(
      getUrls(
        readTxtFile("dist/content.html") +
        readTxtFile("dist/styles.css") +
        readTxtFile("dist/i.css"),
      ),
    )].join("\n"),
  );

})();
