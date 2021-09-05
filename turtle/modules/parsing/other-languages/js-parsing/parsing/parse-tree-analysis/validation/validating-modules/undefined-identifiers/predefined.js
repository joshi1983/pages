import { fetchText } from '../../../../../../../../fetchText.js';

const lines = (await fetchText('json/JavaScript/predefined-identifiers.txt')).
	split('\n').
	map(line => line.trim()).
	filter(line => line !== '');
const predefined = new Set(lines);

export { predefined };