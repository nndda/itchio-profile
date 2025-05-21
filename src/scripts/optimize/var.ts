// --uwu: #abc;
// color: var(--uwu);

// --a: #abc;
// color: var(--a);

import { num2alph } from "../util";

export default function (
  src: string,
  except: string[] = [],
): string {

  return Object

    .entries(
      src
        .matchAll(/--([\w-]+):\s+(.+);/gm)
        .reduce(
          (
            prev: Record<string, string>,
            match: RegExpExecArray,
            i: number,
          ): Record<string, string> => {

            if (
              !(match[1] in prev) &&
              !except.includes("--" + match[1])
            ) {
              prev[match[1]] = num2alph(i);
            }

            return prev;

          },
          { } as Record<string, string>,
        )
    )

    .sort(
      (
        a: [string, string],
        b: [string, string],
      ) => {
        return b[0].length - a[0].length;
      }
    )

    .reduce(
      (
        prev: string,
        [prop, alph]: [string, string],
      ) => {
        return prev
          .replace(
            new RegExp(`--\\b${prop}\\b`, "gm"),
            `--${alph}`,
          )
      },
      src,
    )
  ;
}
