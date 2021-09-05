export async function closeDialog(page) {
	const selector = '#dialog-close';
	await page.waitForSelector(selector);
	await page.click(selector);
};