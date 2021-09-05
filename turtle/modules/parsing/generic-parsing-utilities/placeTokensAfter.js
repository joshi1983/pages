import { isAfterOrSame } from
'./isAfterOrSame.js';

export function placeTokensAfter(tokens, position) {
	for (const token of tokens) {
		if (isAfterOrSame(position, token)) {
			token.lineIndex = position.lineIndex;
			token.colIndex = position.colIndex + 1;
		}
	}
};