// --uwu: #abc;
// color: var(--uwu);

// color: #abc;

import { type CSSVarTransform } from "../css";

export default ( function (
  src: string,
  except: string[] = [],
): string {
  return src
    .matchAll(/(--[\w-]+):\s+(#.+);/gm)
    .reduce(
      (
        prev: string,
        match: RegExpExecArray,
      ): string => {

        const
          orig: string = match[0]
        , varProp: string = match[1]
        , varVal: string = match[2]
        ;

        return !except.includes(varProp) ?
          prev
            .replace(orig, "")
            .replaceAll(`var(${varProp})`, varVal)
            :
          prev
        ;
      },

      src
    )
  ;
} as CSSVarTransform );
