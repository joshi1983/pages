import { getClosestOfType } from
'../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeToken } from
'../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.ARRAY_SUBSCRIPT,
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
	if (prev.type === ParseTreeTokenType.ARRAY_SUBSCRIPT &&
	prev.children.length === 2) {
		const parent = prev.parentNode;
		if (getClosestOfType(parent, ParseTreeTokenType.DATA_TYPE_EXPRESSION) === null) {
			const dte = new ParseTreeToken(null, prev.lineIndex, prev.colIndex, ParseTreeTokenType.DATA_TYPE_EXPRESSION);
			parent.replaceChild(prev, dte);
			dte.appendChild(prev);
		}
	}
	return prev;
};