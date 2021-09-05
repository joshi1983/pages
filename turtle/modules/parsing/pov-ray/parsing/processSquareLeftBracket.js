import { ExpectedChildrenResult, hasAllExpectedChildren } from './hasAllExpectedChildren.js';
import { createKeyValuePair } from './createKeyValuePair.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const expressionIndexExpressionChildTypes = new Set([
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
]);

function isGoodPrevious(token) {
	if (token.parentNode === null)
		return true;
	if (token.type === ParseTreeTokenType.ARRAY)
		return true;
	if (ExpectedChildrenResult.canBeComplete(hasAllExpectedChildren(token)))
		return false;
	return true;
}

function getGoodPrevious(token) {
	const tok = getGoodPreviousForExpressionIndexExpression(token);
	if (shouldPrevBecomeExpressionIndexExpression(tok))
		return tok;
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

function getGoodPreviousForExpressionIndexExpression(token) {
	while (token.children.length !== 0) {
		if (expressionIndexExpressionChildTypes.has(token.type))
			break;
		const children = token.children;
		token = children[children.length - 1];
	}
	return token;
}

function shouldPrevBecomeExpressionIndexExpression(token) {
	token = getGoodPreviousForExpressionIndexExpression(token);
	if (!expressionIndexExpressionChildTypes.has(token.type))
		return false;
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.LOCAL || parent.type === ParseTreeTokenType.DECLARE) {
		if (parent.children.length === 1) {
			const firstChild = parent.children[0];
			if (firstChild.val === '=' && firstChild.type === ParseTreeTokenType.BINARY_OPERATOR)
				return false;
		}
	}
	return true;
}

function insertExpressionIndexExpression(token) {
	token = getGoodPreviousForExpressionIndexExpression(token);
	const e = new ParseTreeToken(null, token.lineIndex, token.colIndex, ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION);
	const parent = token.parentNode;
	parent.replaceChild(token, e);
	e.appendChild(token);
	return e;
}

function shouldPrevBecomeKeyValuePair(prev) {
	if (prev.type !== ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
		return false;
	return true;
}

export function processSquareLeftBracket(prev, next) {
	prev = getGoodPrevious(prev);
	if (shouldPrevBecomeExpressionIndexExpression(prev)) {
		prev = insertExpressionIndexExpression(prev);
	}
	else if (shouldPrevBecomeKeyValuePair(prev)) {
		prev = createKeyValuePair(prev, next, false);
	}
	const e = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION);
	const parent = prev.parentNode;
	prev.appendChild(e);
	e.appendChild(next);
	return next;
};