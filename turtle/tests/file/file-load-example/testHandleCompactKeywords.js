import { exampleToDivCustomClick } from '../../../modules/file/file-load-example/exampleToDivCustomClick.js';
import { fetchJson } from '../../../modules/fetchJson.js';
import { handleCompactKeywords } from '../../../modules/file/file-load-example/handleCompactKeywords.js';
import { noop } from '../../../modules/noop.js';
const examples = await fetchJson('json/scriptExamples.json');
const exampleInfo = examples[0];

export function testHandleCompactKeywords(logger) {
	const exampleDiv = exampleToDivCustomClick(exampleInfo, noop);
	handleCompactKeywords(exampleDiv);
};