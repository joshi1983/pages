import { closeDialog } from './closeDialog.mjs';

export async function openCodeEditor(page) {
	await closeDialog(page);
	const selector = '#commander-edit-all';
	await page.waitForSelector(selector);
	await page.click(selector);
	await page.waitForSelector('#editor-code textarea');
};