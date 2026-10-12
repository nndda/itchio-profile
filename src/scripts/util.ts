// File handling

import { readFileSync, writeFileSync } from "node:fs";
const textEnc: BufferEncoding = "utf-8";

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

// git specific

import type { SimpleGit } from "simple-git";

export async function ghSlug(git: SimpleGit): Promise<string> {
  const
    remotes = await git.getRemotes(true)
  , origin = remotes.find(remote => remote.name === "origin") || remotes[0]
  ;

  // TODO: consider other platforms
  return (origin.refs.push || origin.refs.fetch).match(
    /github\.com[/:]([^/]+\/[^/]+)/
  )![1].replace(/\.git\/?$/, "");
}
