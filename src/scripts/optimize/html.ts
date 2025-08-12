import { minifyFragment } from "@swc/html";
import {
  readTxtFile,
} from "../util";

export default async function (): Promise<string> {
  return (await minifyFragment(
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
  )).code;
};
