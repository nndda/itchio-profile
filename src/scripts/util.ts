// File handling

import {
  readFileSync,
  writeFileSync,
} from "node:fs";


const
  textEnc: BufferEncoding = "utf-8"
;

export function readTxtFile(
  path: string,
): string {

  return readFileSync(path, textEnc);

}

export function writeTxtFile(
  path: string,
  content: string,
): void {

  writeFileSync(path, content, textEnc);

}

// CSS specific

export function num2alph(
  num: number,
): string {

  num++;

  let output = "";

  while (num > 0) {
    output = String.fromCharCode(97 + (--num % 26)) + output;
    num = Math.floor(num / 26);
  }

  return output;

};

export function whyDoesItchIoProfilePageHave5120CharacterCountLimitButOtherPagesDontIDontUnderstand(
  cssArr: string[],
  max: number,
): [string[], string[]] {

  let endLen: number = 0;

  for (let i: number = cssArr.length; i--;) {
    endLen += cssArr[i].length;

    if (endLen >= max) {
      return [
        cssArr.slice(0, i),
        cssArr.slice(i)
      ];
    }
  }

  return [ cssArr, [] ];

}

// git specific

import type
  {
    SimpleGit,
    RemoteWithRefs,
  }
from "simple-git";

export async function ghSlug(git: SimpleGit): Promise<string> {
  const
    remotes: RemoteWithRefs[] = await git.getRemotes(true)
  , origin: RemoteWithRefs = remotes.find((remote: RemoteWithRefs) => remote.name === "origin") || remotes[0]
  ;

  return (origin.refs.push || origin.refs.fetch).match(
    /github\.com[/:]([^/]+\/[^/]+)\.git/
  )![1];
}

