export { default as col } from "./col";
export { default as prop } from "./prop";
export { default as nano } from "./cssnano";

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
