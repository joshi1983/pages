import { fetchJson } from
'../../../fetchJson.js';
import { fetchText } from
'../../../fetchText.js';

const prefix = 'logo-scripts/l-systems/0L/';
const data = await fetchJson(prefix + 'index.json');
const procedures = new Map();
for (const filename of data) {
	const url = prefix + filename;
	const index = filename.lastIndexOf('.');
	const procName = filename.substring(0, index);
	procedures.set(procName.toLowerCase(), await fetchText(url));
}

export class Procedures {
	static getImplementation(name) {
		name = name.toLowerCase();
		return procedures.get(name);
	}
};