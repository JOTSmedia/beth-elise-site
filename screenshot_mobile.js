const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.toString());
  });
  
  page.on('console', msg => {
    console.log('CONSOLE:', msg.text());
  });

  await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
  
  await browser.close();
})();
