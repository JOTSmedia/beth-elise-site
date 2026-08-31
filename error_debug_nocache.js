const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    } else if (msg.text().includes('TINKERBELL TICK')) {
      // console.log('TICK');
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });

  // add random query to force bust cache on index.html
  await page.goto('http://localhost:8000/index.html?t=' + Date.now());
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    document.querySelector('#aura-scanner').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    document.querySelector('#aura-start-scan-btn').click();
  });
  console.log("Clicked Aura Start Scan Button");
  await new Promise(r => setTimeout(r, 2000));
  
  await page.screenshot({ path: '/Users/bethrooney/.gemini/antigravity/brain/645b6279-1818-4280-a305-23efd07c1678/aura_step2_fixed.png' });

  await browser.close();
})();
