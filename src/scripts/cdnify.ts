// user/repo@main
// user/repo@version

import { reHTMLCSSResource, reJSDelivrMainURL } from "./urls";
import { readTxtFile } from "./util";

export default function (
  str: string,
  version: string,
  versionMap: Record<string, string>,
): string {
  const
    urlMap: Record<string, string> = {}
  , urlAssetsVersionMapCached = JSON.parse(readTxtFile("./dist/assets-version.json")) as Record<string, string>
  ;

  for (const reRes of Array
    .from(str.matchAll(reHTMLCSSResource))
  ) {
    if (reJSDelivrMainURL.test(reRes[1])) {
      const
        repo = reRes[1].match(reJSDelivrMainURL)!.groups!["repo"]
      , urlMain = reRes[1]
      ;

      urlMap[urlMain] = urlMain in versionMap
        ? versionMap[urlMain]
        : urlMain.replace(`${repo}@main`, `${repo}@${version}`)
      ;

      urlAssetsVersionMapCached[urlMain] = urlMap[urlMain];
    }
  }

  return Object
    .entries(urlMap)
    .reduce((prev, [ url, urlChoosen ]) => {
      return prev.replaceAll(url, urlChoosen);
    }, str)
  ;
}
