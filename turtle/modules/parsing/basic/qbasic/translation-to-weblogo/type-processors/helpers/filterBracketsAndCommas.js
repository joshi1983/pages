import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const ignoredTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET
]);

/*
Used in similar situations to callTokenToArgValueTokens.
Since QBASIC and some other BASIC dialects don't always separate arguments with commas, 
	callTokenToArgValueTokens is usually more helpful.
*/
export function filterBracketsAndCommas(tokens) {
	return tokens.filter(t => !ignoredTypes.has(t.type));
};