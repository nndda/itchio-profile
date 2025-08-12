import type {
  CSSVarTransform,
} from "./type";

import
  simpleGit,
  {
    type SimpleGit
  }
from "simple-git";

import {
  col,
  prop,
  nano,
  whyDoesItchIoProfilePageHave5120CharacterCountLimitButOtherPagesDontIDontUnderstand,
} from "./optimize";

import {
  getCSSRulesArr
} from "./optimize/util";

import cdnify from "./cdnify";

import {
  ghSlug,
  readTxtFile,
  writeTxtFile,
} from "./util";

import html from "./optimize/html";

( async (): Promise<void> => {

  const
    rawCSS: string = await nano(readTxtFile("./src/styles.css"), true)

  , git: SimpleGit = simpleGit()

  , repoUser: string = await ghSlug(git)

  , version: string = (await import("../../package.json")).default.version

  , CDNImportTemplate: string = `@import url("https://cdn.jsdelivr.net/gh/${repoUser}@${version}/dist/i.css");`
  ;

  let
    cssAll: string = ""
  ;

  console.log(
    "Building HTML...\n",
  );

  writeTxtFile("dist/content.html",
    cdnify(
      await html(),
      repoUser,
      version,
    )
  );

  console.log(
    "Building CSS...\n",
  );

  whyDoesItchIoProfilePageHave5120CharacterCountLimitButOtherPagesDontIDontUnderstand(

    ( await Promise.all(
      ( await getCSSRulesArr(
          ([

              [ col, [ "--primary" ] ],
              [ prop, [ "--d" ] ],

          ] as [ CSSVarTransform, string[] | undefined ][])
            .reduce(
              (
                prev: string,
                val: [ CSSVarTransform, string[] | undefined ]
              ): string => {

                return val[0](prev, val[1] || []);

              },
              rawCSS,
            )
        )
      )
    ) ),

    5120 - 80 - CDNImportTemplate.length,

  ).forEach( async ( arr: string[], i: number ): Promise<void> => {

    const
      imported: boolean = i === 0
    , css: string = await nano(arr.join(""))
    ;

    cssAll += css;

    console.log(
      imported ? "\nCSS character count:\n" : "",
      (
        imported ? "imported" : "main"
      ) + ":", css.length,
    );

    writeTxtFile(
      "dist/" + (
        imported ? "i.css" : "styles.css"
      ),
      (!imported ? CDNImportTemplate : "") +
      cdnify(
        css,
        repoUser,
        version,
      ),
    );

    if (!imported) {

      console.log(
        " total:", cssAll.length
      );

      writeTxtFile(
        "dist/test.css",
        cssAll,
      );

      console.log(
`
+ ----------------------------------------------- +
|                                                 |
|  Build complete.                                |
|  Copy-paste the content of 'dist/test.css'      |
|  to the profile page first,                     |
|  to test it out.                                |
|                                                 |
+ ----------------------------------------------- +
|                                                 |
|  Run 'npm run publish' to push the updates.     |
|  And copy-paste the content of                  |
|  'dist/styles.css'                              |
|                                                 |
+ ----------------------------------------------- +
`
      );

    }

  });

})();
