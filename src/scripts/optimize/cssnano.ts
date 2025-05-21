import postcss from "postcss";
import autoprefixer from "autoprefixer";

import cssnano from "cssnano";
import cssnanoPresetAdvanced from "cssnano-preset-advanced";
const preset = cssnanoPresetAdvanced(
  {
    discardOverridden: false,
    discardUnused: false,
  }
);

export default async function (
  src: string,
): Promise<string> {
  return (
    await postcss([cssnano({ preset, plugins: [autoprefixer] })])
      .process(src, { from: undefined })
    ).css
  ;
}
