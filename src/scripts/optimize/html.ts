import { minifyFragment } from "@swc/html";
import {
  readTxtFile,
  writeTxtFile,
} from "../util";

console.log("Compressing HTML...");

( async () => {
  writeTxtFile(
    "dist/content.html",
    (await minifyFragment(
        readTxtFile("src/content.html"),
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
    )).code
  );
})();
