import { editorTextareaSelector } from './editorTextareaSelector.mjs';
import { exampleFilenameToCompletePath } from './exampleFilenameToCompletePath.mjs';
import { readFile } from './readFile.mjs';

export async function loadExample(page, examplePath) {
	examplePath = exampleFilenameToCompletePath(examplePath);
	await page.waitForSelector(editorTextareaSelector);
	const content = await readFile(examplePath, "utf8");
	await page.evaluate(function(val) {
		const e = document.querySelector('#editor-code textarea');
		e.value = val;
		e.dispatchEvent(new Event('change'));
	}, content);
};