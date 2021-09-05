import { readFile } from './readFile.mjs';

export async function readExamples() {
	const json = await readFile('../json/scriptExamples.json');
	return JSON.parse(json);
};