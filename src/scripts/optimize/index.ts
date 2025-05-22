import fnAnim from "./anim";
import fnCol from "./col";
import fnProp from "./prop";
import fnNano from "./cssnano";

export const anim = fnAnim;
export const col = fnCol;
export const prop = fnProp;
export const nano = fnNano;

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
