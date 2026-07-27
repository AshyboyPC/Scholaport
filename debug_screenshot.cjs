const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/');
  await page.waitForTimeout(5000);
  const html = await page.content();
  console.log(html.substring(0, 1000));
  await browser.close();
})();
