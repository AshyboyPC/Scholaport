const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 4080 } });
  await page.goto('http://localhost:8080/');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshots/landing_bento.png', fullPage: true });
  await browser.close();
})();
