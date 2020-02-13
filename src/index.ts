const { chromium, devices, firefox } = require('playwright');
const playwright = require('playwright');

(async () => {

	await tryDevices();
})();


async function tryDevices() {
	// Loop five times with random locations
	for (let i = 0; i < 5; i++) {
		const latitude = getRandomInRange(-90, 90, 3);
		const longitude = getRandomInRange(-90, 90, 3);

		const pixel2 = devices['Pixel 2'];
		const browser = await chromium.launch({ headless: false });
		const context = await browser.newContext({
			viewport: pixel2.viewport,
			userAgent: pixel2.userAgent,
			// Remove geolocation if using something other than chromium
			geolocation: { longitude: longitude, latitude: latitude },
			permissions: { 'https://www.google.com': ['geolocation'] }
		});
		const page = await context.newPage();
		await page.goto('https://maps.google.com');
		await page.click('text="Your location"');
		await page.waitForRequest(/.*pwa\/net.js.*/);
		await page.screenshot({ path: `${longitude}, ${latitude}-android.png` });
		await browser.close();
	}
}

async function tryBrowsers() {

	for (const browserType of ['chromium', 'firefox', 'webkit']) {

		const browser = await playwright[browserType].launch({ headless: false });
		const context = await browser.newContext({
			viewport: { width: 1080, height: 1080 }

		});
		const page = await context.newPage();

		await page.goto('https://cobaltintelligence.com/');

		// Search through content and find pricing
		// const headerElementHandles = await page.$$('.hometop-btn .mat-button-wrapper');

		// for (let elementHandle of headerElementHandles) {
		// 	const text: string = await elementHandle.$eval('strong', element => element.textContent);
		// 	console.log('text', text);

		// 	if (text && text.toLocaleLowerCase().includes('pricing')) {
		// 		await elementHandle.click();
		// 	}
		// }

		// Click based on text content
		await page.click('text="Pricing"');

		await page.screenshot({ path: `cobalt-int-${browserType}.png` });

		await browser.close();

	}
}

function getRandomInRange(from, to, fixed) {
	return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}
