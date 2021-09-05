import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.ARRAY_SUBSCRIPT,
	ParseTreeTokenType.DATA_TYPE_EXPRESSION
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION &&
	token.children.length !== 0)
		return false;
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(prev) {
	while (!isGoodPrevious(prev))
		prev = prev.parentNode;
	return prev;
}

export function processTripleDot(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return prev;
};