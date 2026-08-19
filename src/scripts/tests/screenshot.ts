import puppeteer,
  {
    type ScreenshotOptions,
    type ElementHandle,
    type Page,
  } from "puppeteer";

import { mkdir } from "fs/promises";

(async () => {
  const
    packageJSON = await Bun.file("./package.json").json()

  , itchUser = packageJSON.itchUsername
  , version = packageJSON.version
  ;

  console.log("Launching browser...");

  const
    browser = await puppeteer.launch()
  , page = await browser.newPage()

  , itchUrl = `${itchUser}.itch.io`

  , css = await Bun.file("./dist/test.css").text()
  , html = await Bun.file("./dist/content.html").text()
  ;

  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  console.log(`Visiting "${itchUrl}"...`);

  await page.goto(`https://${itchUrl}/`, {
    waitUntil: "domcontentloaded",
  });

  console.log(`Visited "${await page.title()}"`);

  console.log("Preparing page...");

  console.log("Applying CSS...");
  await page.addStyleTag({
    content: css,
  });

  console.log("Injecting HTML...");
  await page.evaluate((html) => {
      // TODO: yeet browser's errs to node/bun/terminal
      //
      for (const img of document.images) {
        img.loading = "eager";
      }

      //
      const customCSSEl = document.getElementById("custom_css");
      if (customCSSEl) {
        customCSSEl.innerHTML = "";
      }

      //
      document.querySelector(".user_profile.formatted")!.innerHTML = html;
  }, html);

  const height: number = await page.evaluate(() => document.documentElement.scrollHeight);

  await page.setViewport({
    width: 1920,
    height: height,
  });

  console.log("Waiting for fonts...");
  await page.evaluate(() => document.fonts.ready);

  console.log("Waiting for network idle...");
  await page.waitForNetworkIdle();

  console.log("Taking screenshoots...");
  await mkdir(`./screenshots/${version}/`, {
    recursive: true,
  });

  async function screenshot(
      id: string,
      target: Page | ElementHandle<Element> = page,
      // TODO: this stinks
      override: Partial<ScreenshotOptions> = {},
  ) {
    const filepath = `./screenshots/${version}/${itchUrl}_${version}_${id}.webp`;
    console.log(`Saving "${filepath}"...`);

    await target.screenshot({
      path: filepath,
      fullPage: true,
      quality: 100,
      ... override,
    });
  }

  const
    screenshotCount = 5
  , pageElement = (await page.waitForSelector(".user_page"))!
  ;

  for (let i = screenshotCount; i-- > 0;) {
    await screenshot(`desktop_${i}`);
    await screenshot(`preview_${i}`, pageElement, { fullPage: undefined });
  }

  await page.setViewport({
    width: 412,
    height: 915,
  });

  for (let i = screenshotCount; i-- > 0;) {
    await screenshot(`mobile_${i}`);
  }

  await browser.close();
})();
