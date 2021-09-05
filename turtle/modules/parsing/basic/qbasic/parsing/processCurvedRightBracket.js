import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.TUPLE_LITERAL,
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	const children = token.children;
	if (children.length === 0)
		return false;
	const lastChild = children[children.length - 1];
	if (lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
		return false;
	const firstChild = children[0];
	if (firstChild.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET)
		return false;
	
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processCurvedRightBracket(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return prev;
};