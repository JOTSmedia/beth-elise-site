const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('ERROR')) {
      console.log('BROWSER LOG:', msg.text());
    }
  });

  await page.goto('http://localhost:8000/index.html');
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    window.onerror = function(message, source, lineno, colno, error) {
      console.log('WINDOW ERROR:', message, lineno, error ? error.stack : '');
      return false;
    };
  });

  await page.evaluate(() => {
    document.querySelector('#aura-scanner').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    document.querySelector('#aura-start-scan-btn').click();
  });
  console.log("Clicked Aura Start Scan Button");
  await new Promise(r => setTimeout(r, 2000));

  await browser.close();
})();
