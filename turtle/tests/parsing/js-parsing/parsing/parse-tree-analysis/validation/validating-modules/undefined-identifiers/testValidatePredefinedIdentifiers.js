import { fetchText } from
'../../../../../../../../modules/fetchText.js';
const content = await fetchText('json/JavaScript/predefined-identifiers.txt');

export function testValidatePredefinedIdentifiers(logger) {
	const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');
	for (let i = 1; i < lines.length; i++) {
		const prev = lines[i - 1].toLowerCase();
		const line = lines[i].toLowerCase();
		if (prev.localeCompare(line) > 0) {
			logger(`Lines out of order. ${prev} and ${line}`);
		}
	}
};