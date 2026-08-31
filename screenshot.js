const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Desktop
  await page.setViewport({ width: 1080, height: 1024, deviceScaleFactor: 2 });
  await page.goto('file:///Users/bethrooney/Desktop/JOTS.MEDIA_AG/clients/bethElisePsychic_v50/index.html');
  await page.screenshot({ path: '/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678/final_desktop.png' });

  // Mobile
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('file:///Users/bethrooney/Desktop/JOTS.MEDIA_AG/clients/bethElisePsychic_v50/index.html');
  await page.screenshot({ path: '/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678/final_mobile.png' });
  
  await browser.close();
})();
