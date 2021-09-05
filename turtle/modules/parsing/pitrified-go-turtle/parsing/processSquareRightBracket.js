import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.ARRAY_SUBSCRIPT,
	ParseTreeTokenType.TYPE_PARAMETERS
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;

	const children = token.children;
	if (children.length !== 0) {
		const lastChild = children[children.length - 1];
		if (lastChild.type === ParseTreeTokenType.ARRAY_SUBSCRIPT)
			return false;
	}
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processSquareRightBracket(prev, next) {
	prev = getGoodPrevious(prev);
	prev.appendChild(next);
	return prev;
};