import { simpleGit } from "simple-git";
import { readTxtFile } from "./util";
import { chooseOldest } from "./version";

export const
  reHTMLCSSResource = /(?:src=|url)(?:\(|"|'|\(")(https:\/\/.+?)(?:"\)|\)|"|')/gm
, reJSDelivrMainURL = /https:\/\/cdn\.jsdelivr\.net\/.+?\/(?<repo>.+?\/.+?)@main\//
, reJSDelivr =       /^https:\/\/cdn\.jsdelivr\.net\/.+?\/(?<repo>.+?\/.+?)@(?<ver>.+?)\/.+?$/gm
;

export function getUrls(src: string): string[] {
  return Array
    .from(src.matchAll(reHTMLCSSResource))
    .map(res => res[1])
  ;
}

export async function mapOldest(): Promise<Record<string, string>> {

  const
    urls = readTxtFile("dist/urls.txt")
      .split("\n")
      .filter(url => reJSDelivr.test(url))
  , tags = (await simpleGit().tags()).all
  , urlTagsMap = urls.reduce((prev, url) => {
      const
        urlTags: string[] = []
      , urlMain: string = url.replace(reJSDelivr, (match, repo, ver) => {
          const verStr = `${repo}@${ver}`;

          urlTags.push(
            ...tags.map(tag => {
              return match.replace(verStr, `${repo}@${tag}`);
            }),
          );
          return match.replace(verStr, `${repo}@main`)
        })
      ;

      prev[urlMain] = urlTags;
      return prev;
    }, {} as Record<string, string[]>)
  ;

  const oldestMap: Record<string, string> = {};

  for (const [ urlMain, urlTags ] of  Object.entries(urlTagsMap)) {
    oldestMap[urlMain] = await chooseOldest(urlTags, urlMain);
  }

  return oldestMap;
}

// TODO:
// (async () => {
//   const oldestResult = await mapOldest();
//   console.log(oldestResult);
//   writeTxtFile("dist/assets-version.json", JSON.stringify(oldestResult));
// })();
