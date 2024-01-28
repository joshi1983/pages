import { getTokensAtLine } from './getTokensAtLine.js';

/*
Used for changing a parse tree
*/
export function insertColIndexSpanAt(token, colSpanLength) {
	const tokensAtLine = getTokensAtLine(token);
	for (let i = 0; i < tokensAtLine.length; i++) {
		const tokenOnLine = tokensAtLine[i];
		if (tokenOnLine.colIndex > token.colIndex) {
			tokenOnLine.colIndex += colSpanLength;
		}
	}
};