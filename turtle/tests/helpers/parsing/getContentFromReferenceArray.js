import { fetchJson } from '../../../modules/fetchJson.js';
import { fetchText } from '../../../modules/fetchText.js';

export async function getContentFromReferenceArray(url) {
	const prefix = url.substring(0, url.lastIndexOf('/') + 1);
	const index = await fetchJson(url);
	const examples = [];
	for (const filename of index) {
		const content = await fetchText(prefix + filename);
		examples.push(content);
	}
	return examples;
};