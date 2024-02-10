import { endsWithPotentialRegularExpressionFlags } from './endsWithPotentialRegularExpressionFlags.js';

function isAdjacent(token1, token2) {
	if (token1 === undefined || token2 === undefined)
		return false;
	if (token2.lineIndex === token1.lineIndex &&
	token2.colIndex === token1.colIndex + token1.s.length)
		return true;
	if (token2.lineIndex !== token1.lineIndex) {
		const lines = token2.s.split('\n');
		if (lines.length + token1.lineIndex !== token2.lineIndex)
			return false;
	}
	return true;
}

export function indexOfRegExEnd(tokens, startIndex) {
	let token = tokens[startIndex];
	if (!token.s.startsWith('/') || token.s.startsWith('//'))
		return -1;
	if (startIndex !== 0 &&
	!tokens[startIndex - 1].s.endsWith('\n') &&
	isAdjacent(tokens[startIndex - 1], token))
		return -1;
	for (let i = startIndex; i < tokens.length; i++) {
		token = tokens[i];
		if (i === startIndex && token.s.lastIndexOf('/') === 0)
			continue;
		if (endsWithPotentialRegularExpressionFlags(token.s) &&
		!isAdjacent(tokens[i], tokens[i + 1])) {
			return i;
		}
	}
	return -1;
};