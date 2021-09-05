import { createTokenFromToken } from './createTokenFromToken.js';
import { getSortedLastDescendentTokenOf } from
'../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js'; 
import { isCompleteToken } from './isCompleteToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { willBecomePrintFunctionCall } from './willBecomePrintFunctionCall.js';

const subscriptExpressionFirstChildTypes = new Set([
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.LIST_LITERAL,
	ParseTreeTokenType.SUBSCRIPT_EXPRESSION,
	ParseTreeTokenType.TUPLE_LITERAL
]);

export { subscriptExpressionFirstChildTypes };

function isGoodPreviousForListLiteral(prev) {
	if (prev.parentNode === null)
		return true;
	if (prev.type === ParseTreeTokenType.IN) {
		return false;
	}
	return true;
}

function getGoodPreviousForListLiteral(prev) {
	while (!isGoodPreviousForListLiteral(prev))
		prev = prev.parentNode;
	return prev;
}

function getCreateSubscriptInfo(prev, next) {
	const lastDescendent = getSortedLastDescendentTokenOf(prev);
	if (lastDescendent.lineIndex !== next.lineIndex)
		return;
	if (willBecomePrintFunctionCall(prev))
		return;
	const children = prev.children;
	if (children.length === 0 || prev.type === ParseTreeTokenType.LIST_LITERAL) {
		if (prev.type === ParseTreeTokenType.IDENTIFIER ||
		(prev.type === ParseTreeTokenType.LIST_LITERAL && isCompleteToken(prev)))
			return [prev.parentNode, prev];
		return;
	}
	if (children.length === 1 && prev.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
		return;

	const lastChild = children[children.length - 1];
	if (subscriptExpressionFirstChildTypes.has(lastChild.type))
		return [prev, lastChild];
}

export function processSquareLeftBracket(prev, next) {
	const subscriptInfo = getCreateSubscriptInfo(prev, next);
	if (subscriptInfo !== undefined) {
		const listParent = subscriptInfo[0];
		const listExpression = subscriptInfo[1];
		const se = createTokenFromToken(null, prev, ParseTreeTokenType.SUBSCRIPT_EXPRESSION);
		const subscript = createTokenFromToken(null, next, ParseTreeTokenType.SUBSCRIPT);
		listParent.replaceChild(listExpression, se);
		listExpression.remove();
		se.appendChild(listExpression);
		se.appendChild(subscript);
		subscript.appendChild(next);
		return subscript;
	}
	else {
		const listLiteral = createTokenFromToken(null, next, ParseTreeTokenType.LIST_LITERAL);
		listLiteral.appendChild(next);
		prev = getGoodPreviousForListLiteral(prev);
		prev.appendChild(listLiteral);
		return listLiteral;
	}
};