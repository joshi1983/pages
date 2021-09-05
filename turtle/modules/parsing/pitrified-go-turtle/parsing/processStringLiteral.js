import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.STRING_LITERAL
]);

function isGoodPrevious(token) {
	const parent = token.parentNode;
	if (parent === null)
		return true;
	if ((token.type === ParseTreeTokenType.IDENTIFIER ||
	token.type === ParseTreeTokenType.DOT) &&
	parent.type === ParseTreeTokenType.IMPORT &&
	parent.children.length === 1) {
		return false;
	}

	return !badPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processStringLiteral(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};