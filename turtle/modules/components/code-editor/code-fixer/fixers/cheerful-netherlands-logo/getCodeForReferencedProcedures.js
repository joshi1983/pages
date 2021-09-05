import { fetchJson } from
'../../../../../fetchJson.js';
import { fetchText } from
'../../../../../fetchText.js';
import { StringBuffer } from
'../../../../../StringBuffer.js';

const directoryPath = './logo-scripts/cheerful-netherlands-logo-content/';
const url = `${directoryPath}index.json`;
console.log(url);
const procsData = await fetchJson(url);
const procsMap = new Map();
for (const name of procsData) {
	procsMap.set(name, await fetchText(`${directoryPath}${name}`));
}

export function getCodeForReferencedProcedures(tokens) {
	const result = new StringBuffer();
	const namesIncluded = new Set();
	for (const token of tokens) {
		const name = token.s;
		if (procsMap.has(name)) {
			namesIncluded.add(name);
		}
	}
	const namesArray = Array.from(namesIncluded);
	namesArray.sort();
	for (const name of namesArray) {
		result.append(procsMap.get(name));
		result.append('\n\n');
	}
	return result.toString();
};