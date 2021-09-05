import { convertArgListToExpression } from './convertArgListToExpression.js';
import { isArgListToConvertToExpression } from './isArgListToConvertToExpression.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 
	// only because it could become a TUPLE_LITERAL later in the parsing process.

	ParseTreeTokenType.TUPLE_LITERAL
]);

function isGoodPreviousUp(token) {
	if (token.parentNode === null)
		return true;
	return goodPreviousTypes.has(token.type);
}

function isGoodPreviousDown(token) {
	const children = token.children;
	if (children.length === 0)
		return true;
	return goodPreviousTypes.has(token.type);
}

function getGoodPrevious(token) {
	while (!isGoodPreviousUp(token))
		token = token.parentNode;
	while (!isGoodPreviousDown(token)) {
		const children = token.children;
		token = children[children.length - 1];
	}
	return token;
}

export function processComma(prev, next) {
	prev = getGoodPrevious(prev);
	if (isArgListToConvertToExpression(prev))
		convertArgListToExpression(prev);
	prev.appendChild(next);
	return prev;
};