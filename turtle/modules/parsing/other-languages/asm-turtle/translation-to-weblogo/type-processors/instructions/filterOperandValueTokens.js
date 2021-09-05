import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

const ignoredTypes = new Set([
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.COMMA
]);

function isNotIgnored(token) {
	return !ignoredTypes.has(token.type);
}

export function filterOperandValueTokens(tokens) {
	return tokens.filter(isNotIgnored);
};