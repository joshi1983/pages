import { fetchJson } from
'../../../fetchJson.js';
import { fetchText } from
'../../../fetchText.js';

const prefix = 'logo-scripts/basic/basic-256/';
const procs = await fetchJson(prefix + 'index.json');
const procMap = new Map();
for (const filename of procs) {
	const code = await fetchText(prefix + filename);
	const procName = filename.substring(0, filename.length - 4);
	procMap.set(procName.toLowerCase(), code);
}

class Basic256Procedures {
	static get(name) {
		return procMap.get(name.toLowerCase());
	}
	
	static has(name) {
		return procMap.has(name.toLowerCase());
	}
}

export { Basic256Procedures };