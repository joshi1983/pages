import { convertArgListToExpression } from './convertArgListToExpression.js';
import { isArgListToConvertToExpression } from './isArgListToConvertToExpression.js';
import { isComplete } from './isComplete.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const goodPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.CASE,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 
	// only because it could become a TUPLE_LITERAL later in the parsing process.

	ParseTreeTokenType.DEF_PRIMITIVE,
	ParseTreeTokenType.DIM,
	ParseTreeTokenType.SHARED,
	ParseTreeTokenType.TUPLE_LITERAL,
	ParseTreeTokenType.TYPE
]);

function shouldPreviousBecomeTupleLiteral(token) {
	if (token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return true;
	return false;
}

function isGoodPreviousUp(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.TUPLE_LITERAL ||
	token.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		return !isComplete(token);
	}
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
	else if (shouldPreviousBecomeTupleLiteral(prev))
		prev.type = ParseTreeTokenType.TUPLE_LITERAL;
	if (prev.type === ParseTreeTokenType.IDENTIFIER)
		prev.appendSibling(next);
	else
		prev.appendChild(next);
	return prev;
};