const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({headless: 'new'});
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    
    await page.goto('file:///Users/bethrooney/Desktop/JOTS.MEDIA_AG/clients/bethElisePsychic_v50/index.html');
    await new Promise(r => setTimeout(r, 6000));
    console.log("Done waiting.");
    await browser.close();
})();
