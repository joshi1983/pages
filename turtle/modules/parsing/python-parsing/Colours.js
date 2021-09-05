import { fetchText } from '../../fetchText.js';

const colourContent = await fetchText('json/logo-migrations/python/colours.txt');
const nameHexMap = new Map();
colourContent.split('\n').forEach(function(line) {
	const index = line.indexOf(' ');
	const name = line.substring(0, index).trim();
	const hex = line.substring(index + 1).trim();
	nameHexMap.set(name, hex);
});

export class Colours {
	static nameToHex(name) {
		return nameHexMap.get(name);
	}
};