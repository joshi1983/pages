import { flatten } from './flatten.js';
import { getTokensAtLine } from './getTokensAtLine.js';
import { isAfterOrSame } from './isAfterOrSame.js';

/*
Used for changing a parse tree
*/
export function insertLineIndexSpanAt(token, lineSpanLength) {
	const allTokens = flatten(token);
	for (let i = 0; i < allTokens.length; i++) {
		const currentToken = allTokens[i];
		if (isAfterOrSame(currentToken, token) && currentToken !== token) {
			currentToken.lineIndex += lineSpanLength;
		}
	}
};