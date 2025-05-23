import { spawn } from "node:child_process";

import {
  simpleGit,
  type SimpleGit,
  type TagResult,
  type StatusResult,
} from "simple-git";


( async (): Promise<void> => {

  function lsFiles(files: string[]): string {
    return files.map(
      (file: string) => "  - " + file
    ).join("\n");
  }

  function getModified(
    status: StatusResult,
    files: string[],
  ): string[] {
    return files.filter((file: string) => {
      return status.modified.includes(file);
    });
  }

  try {

    const
      git: SimpleGit = simpleGit()

    , tags: TagResult = await git.tags()
    , version: string = (await import("../../package.json")).default.version
    ;

    if (tags.all.includes(version)) {
      throw new Error(
        `Tag '${version}' already exist.\n` +
        "Bump/update the 'version' field in package.json first."
      );
    }

    const

      status: StatusResult = await git.status()

    , distFiles: string[] = [
        "dist/content.html",
        "dist/styles.css",
        "dist/i.css",
      ]

    , distModified: string[] = getModified(status, distFiles)

    , srcModified: string[] = getModified(status, [
        "src/styles.css",
        "src/content.html",
      ])
    ;

    // Staging

    if (distModified.length === 0) {
      throw new Error(
        "Error: At least one of the following files must be modified:\n" +
        lsFiles(distFiles) +
        "\nMake sure to run `npm run build` first"
      );
    }

    await git.add(distModified);
    console.log(
      "Staged files:\n",
      lsFiles(distModified),
    )

    if (srcModified.length > 0) {
      await git.add(srcModified);

      console.log(lsFiles(srcModified));

    } else {
      console.log("CSS/HTML source not modified.");
    }

    // Committing

    await new Promise<void>((
      resolve: (value: void | PromiseLike<void>) => any,
      reject: (reason: any) => void,
    ): void => {
      spawn(
        "git",
        [ "commit", "-m", version ],
        { stdio: "inherit" }
      ).on(
        "exit",
        (code: number): void => {
          code === 0 ?
            resolve() :
            reject(new Error(`git commit failed with code: ${code}`))
        }
      );
    });

    // Pushing

    await git.addTag(version);
    await git.push("origin", "HEAD");
    await git.pushTags("origin");

  } catch (err: unknown) {
    console.error(
      err instanceof Error ? err.message : String(err)
    );
    process.exit(1);
  }

})();