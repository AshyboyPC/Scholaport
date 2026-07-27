const { chromium } = require('playwright');
const fs = require('fs');

const routes = [
  { name: 'landing', url: 'http://localhost:8080/' },
  { name: 'app_dashboard', url: 'http://localhost:8080/visual-qa.html?route=/' },
  { name: 'app_profile_passport', url: 'http://localhost:8080/visual-qa.html?route=/profile' },
  { name: 'app_settings', url: 'http://localhost:8080/visual-qa.html?route=/settings' },
  { name: 'app_pori', url: 'http://localhost:8080/visual-qa.html?route=/pori' },
  { name: 'app_gaps', url: 'http://localhost:8080/visual-qa.html?route=/gaps' },
  { name: 'app_roadmap', url: 'http://localhost:8080/visual-qa.html?route=/roadmap' },
  { name: 'app_transcript', url: 'http://localhost:8080/visual-qa.html?route=/transcript' },
  { name: 'app_packet', url: 'http://localhost:8080/visual-qa.html?route=/packet' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1080 } });
  const page = await context.newPage();
  
  if (!fs.existsSync('final_app_png_screenshots')) {
    fs.mkdirSync('final_app_png_screenshots');
  }

  const artifactDir = '/Users/its_shwindy/.gemini/antigravity-ide/brain/c69814a4-1641-40a6-a2e8-7f5ad5b8b00b/screenshots';
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  for (const route of routes) {
    try {
      console.log(`Navigating to ${route.url}...`);
      await page.goto(route.url, { waitUntil: 'networkidle', timeout: 15000 });
      
      // Scroll down the page to trigger all GSAP ScrollTrigger animations
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 350;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 60);
        });
      });
      
      // Wait for all GSAP timelines & transitions to settle
      await page.waitForTimeout(2500); 

      const savePath = `final_app_png_screenshots/${route.name}.png`;
      await page.screenshot({ path: savePath, fullPage: true });
      console.log(`Saved ${savePath}`);
      
      const artifactPath = `${artifactDir}/${route.name}.png`;
      fs.copyFileSync(savePath, artifactPath);
      console.log(`Updated artifact screenshot ${artifactPath}`);
    } catch (e) {
      console.error(`Failed to capture ${route.url}: ${e.message}`);
    }
  }

  await browser.close();
})();
