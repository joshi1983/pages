import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.IMPORT_PACKAGE_LIST
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.children.length !== 0) {
		const lastChild = token.children[token.children.length - 1];
		if (lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			return false;
	}
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
	if (goodPreviousTypes.has(prev.type))
		return prev.parentNode;
	else
		return prev;
};