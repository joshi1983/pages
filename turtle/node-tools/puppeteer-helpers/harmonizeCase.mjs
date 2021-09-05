import { sleep } from './sleep.mjs';

/*
Assumes the editor is already open
*/
export async function harmonizeCase(page) {
	await page.evaluate(function() {
		const e = document.getElementById('editor-harmonize-case');
		e.dispatchEvent(new Event('click'));
	});
};