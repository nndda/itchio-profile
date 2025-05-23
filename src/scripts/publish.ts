import {
  spawnSync,
  type SpawnSyncReturns,
} from "node:child_process";

import {
  simpleGit,
  type SimpleGit,
  type TagResult,
  type StatusResult,
} from "simple-git";


function cmd(
  command: string,
  args: string[],
  errMsg: string,
): void {
  const result: SpawnSyncReturns<Buffer<ArrayBufferLike>> = spawnSync(
    command,
    args,
    { stdio: "inherit" },
  );

  if (result.error) throw new Error(
    result.error.message
  );

  if (result.status !== 0) throw new Error(
    `Error ${result.status}: ` + errMsg
  );
}


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

    // Validate CSS

    [
      "dist/styles.css",
      "dist/i.css",
    ].forEach((file: string): void => {
      cmd(
        "npx",
        [
          "csstree-validator",
          file,
        ],
        "CSS output validation failed",
      );
    });

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

    cmd(
      "npm",
      [
        "version",
        version,
        "--allow-same-version",
        "--no-commit-hooks",
        "--no-git-tag-version",
      ],
      "Failed to sync package-lock.json version.",
    );

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
        "package-lock.json",
        "package.json",
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

    cmd(
      "git",
      [ "commit", "-m", version ],
      "git commit failed",
    );

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
