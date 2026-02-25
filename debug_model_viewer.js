const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        page.on('console', msg => {
            console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
        });

        page.on('pageerror', err => {
            console.error('[BROWSER ERROR]', err.toString());
        });

        page.on('requestfailed', request => {
            console.error(`[NETWORK FAILED] ${request.url()} - ${request.failure().errorText}`);
        });

        console.log("Navigating to http://localhost:3000/product/201124...");
        await page.goto('http://localhost:3000/product/201124', { waitUntil: 'networkidle0', timeout: 30000 });

        console.log("Page loaded. Waiting 5s for model viewer to attempt rendering...");
        await new Promise(r => setTimeout(r, 5000));

        await browser.close();
        console.log("Done.");
    } catch (e) {
        console.error("Script failed:", e);
    }
})();
