import { isAfterOrSame } from './isAfterOrSame.js';

export function getSortedLastTokenFromArray(tokens, tieBreakCompare) {
	let result = tokens[0];
	for (let i = 1; i < tokens.length; i++) {
		const tok = tokens[i];
		if (isAfterOrSame(tok, result)) {
			if (tok.colIndex === result.colIndex &&
			tok.lineIndex === result.lineIndex &&
			tieBreakCompare(result, tok) > 0) {
				continue;
			}
			result = tok;
		}
	}
	return result;
};