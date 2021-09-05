import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.FOR,
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;

	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processSemicolon(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return next;
};