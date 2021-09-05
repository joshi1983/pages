import { getSortedLastDescendentTokenOf } from
'../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { isComplete } from './isComplete.js';
import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

const expressionDotPrevTypes = new Set([
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
]);

function shouldCreateExpressionDot(prev) {
	return expressionDotPrevTypes.has(prev.type);
}

function isGoodPreviousUp(token) {
	if (token.parentNode === null)
		return true;
	const children = token.children;
	const lastChild = children[children.length - 1];
	if (token.type === ParseTreeTokenType.ARG_LIST &&
	children.length !== 0 &&
	lastChild.type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
		return false;
	if (!isComplete(token))
		return true;
	return expressionDotPrevTypes.has(token.type);
}

function isGoodPreviousDown(token) {
	const children = token.children;
	if (children.length === 0)
		return true;
	const firstChild = children[0];
	const lastChild = children[children.length - 1];
	if (expressionDotPrevTypes.has(token.type)) {
		if (firstChild !== undefined && firstChild.type === ParseTreeTokenType.CURVED_LEFT_BRACKET &&
		lastChild.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET)
			return false;
		return true;
	}
	return false;
}

function getGoodPrevious(token) {
	const lastDescendent = getSortedLastDescendentTokenOf(token);
	if (lastDescendent.type === ParseTreeTokenType.IDENTIFIER)
		return lastDescendent;
	while (!isGoodPreviousUp(token))
		token = token.parentNode;
	while (!isGoodPreviousDown(token)) {
		const children = token.children;
		token = children[children.length - 1];
	}
	return token;
}

export function processDot(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldCreateExpressionDot(prev)) {
		const expressionDot = new ParseTreeToken(null, next.lineIndex, next.colIndex,
			ParseTreeTokenType.EXPRESSION_DOT);
		const prevParent = prev.parentNode;
		prevParent.replaceChild(prev, expressionDot);
		expressionDot.appendChild(prev);
		expressionDot.appendChild(next);
		return expressionDot;
	}
	prev.appendChild(next);
	return prev;
};