import { escapeSpecialCharacters } from './escapeSpecialCharacters.js';
import { getURLMatches } from './getURLMatches.js';
import { StringBuffer } from '../../StringBuffer.js';

export function processHyperlinks(s) {
	const urlMatches = getURLMatches(s);
	const result = new StringBuffer();
	let outIndex = 0;
	for (let i = 0; i < urlMatches.length; i++) {
		const match = urlMatches[i];
		if (outIndex <= match.startIndex - 1)
			result.append(escapeSpecialCharacters(s.substring(outIndex, match.startIndex)));
		result.append(`<a href="${escapeSpecialCharacters(match.s)}" target="_blank">${escapeSpecialCharacters(match.s)}</a>`);
		outIndex = match.startIndex + match.s.length;
	}
	if (outIndex < s.length)
		result.append(s.substring(outIndex));
	return result.toString();
};