import { readTxtFile } from "../../scripts/util";

(async () => {
  // const log: Record<string, string> = {};
  const logFailed: Record<string, string> = {};

  let failed = 0;

  for (const url of readTxtFile("dist/urls.txt").trim().split("\n")) {
    const
      res = await fetch(url)
    , msg = `${res.status} - ${res.statusText}`
    ;

    // log[url] = msg;

    (res.ok ? console.log : console.error)(msg, url);

    if (!res.ok) {
      logFailed[url] = msg;
      failed++;
    }
  }

  // console.log(log);
  if (failed > 0) {
    console.log(`Error fetching ${failed} URL(s):`, logFailed);
  }

  process.exitCode = failed;
})();
