import { spawnSync } from "node:child_process";
import { simpleGit, type StatusResult } from "simple-git";

function cmd(
  command: string,
  args: string[],
  errMsg: string,
): void {
  const result = spawnSync(
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

    [
      "bun",
      "git",
    ].forEach((bin: string): void => {
      console.log(`Checking \`${bin}\`...`)
      cmd(bin, ["--version"], `\`${bin}\` not found`);
    });

    // Validate CSS

    cmd(
      "bun",
      [
        "run",
        "validate:css",
      ],
      "CSS output validation failed",
    );

    const git = simpleGit();
    await git.fetch();

    const gitStats = await git.status();

    if (gitStats.detached) {
      throw new Error("git: detached HEAD");
    }

    if (gitStats.behind > 0) {
      throw new Error(`git: branch behind upstream by ${gitStats.behind}`);
    }

    const
      tags = await git.tags()
    , version: string = (await import("../../package.json")).default.version
    ;

    if (tags.all.includes(version)) {
      throw new Error(
        `git: tag '${version}' already exist.` +
        "Bump/update the 'version' field in package.json first."
      );
    }

    const
      status = await git.status()

    , distFiles = [
        "dist/content.html",
        "dist/styles.css",
        "dist/i.css",
        "dist/test.css",
        "dist/i.woff2",

        "dist/assets-version.json",
        "dist/urls.txt",
      ]

    , distModified = getModified(status, distFiles)

    , srcModified = getModified(status, [
        "src/styles.css",
        "src/content.html",
        "src/icons.txt",
        "bun.lock",
        "package.json",
      ])
    ;

    // Staging
    if (distModified.length === 0) {
      throw new Error(
        "Error: At least one of the following files must be modified:\n" +
        lsFiles(distFiles) +
        "\nMake sure to run `bun run build` first"
      );
    }

    await git.add(distModified);
    console.log(
      "Staged files:\n",
      lsFiles(distModified),
    );

    if (srcModified.length > 0) {
      await git.add(srcModified);
      console.log(lsFiles(srcModified));
    } else {
      console.log("CSS/HTML source not modified.");
    }

    // Committing
    await git.commit(version, ["--no-verify"]);

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
