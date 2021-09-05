import { sleep } from './sleep.mjs';

/*
Assumes the editor is already open
*/
export async function autoFix(page) {
	await page.evaluate(function() {
		const e = document.getElementById('editor-fix-code');
		e.dispatchEvent(new Event('click'));
	});
};