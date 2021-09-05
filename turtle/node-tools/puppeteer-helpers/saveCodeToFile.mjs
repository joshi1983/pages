import { editorTextareaSelector } from './editorTextareaSelector.mjs';
import { exampleFilenameToCompletePath } from './exampleFilenameToCompletePath.mjs';
import fs from 'fs/promises';

export async function saveCodeToFile(page, exampleFilename) {
	const examplePath = exampleFilenameToCompletePath(exampleFilename);
	let code = await page.$eval(editorTextareaSelector, e => e.value);
	// replace all '\r\n' with '\n'.
	code = code.trim();
	code = code.split('\n').join('\r\n');
	await fs.writeFile(examplePath, code);
};