import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const typesThatMightNotNeedSpaces = new Set([
	ParseTreeTokenType.VARIABLE_READ
]);

export function mightNeedSpaceBetweenTokens(token1, token2) {
	if (token2 === undefined)
		return false;
	if (token2.isNeedingSpaceBefore)
		return true;
	if (token2.lineIndex !== token1.lineIndex)
		return true;
	if (typesThatMightNotNeedSpaces.has(token2.type)) {
		const len = token2.toString().length;
		if (token2.colIndex - len <= token1.colIndex)
			return false;
	}
	return true;
};