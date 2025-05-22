import postcss from "postcss";
import autoprefixer from "autoprefixer";

import cssnano from "cssnano";
import cssnanoPresetAdvanced, { type SimpleOptions } from "cssnano-preset-advanced";

export default async function (
  src: string,
  reduceIdents: boolean = false,
): Promise<string> {
  const preset = cssnanoPresetAdvanced(
    {
      discardOverridden: false,
      discardUnused: false,
      reduceIdents: reduceIdents as SimpleOptions,
    }
  );

  return (
    await postcss([cssnano({ preset, plugins: [autoprefixer] })])
      .process(src, { from: undefined })
    ).css
  ;
}
