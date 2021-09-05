import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { getClosestOfType } from '../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { shouldAppendChild } from './shouldAppendChild.js';

const expressionDotPreviousTypes = new Set([
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
]);
const goodExpressionDotChildTypes = new Set([
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
]);
const appendSiblingPreviousTypes = new Set([
	ParseTreeTokenType.INDEX_EXPRESSION
]);
const badPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.INDEX_EXPRESSION,
]);

function shouldCreateExpressionDot(previousToken) {
	if (expressionDotPreviousTypes.has(previousToken.type))
		return true;
	if (previousToken.type === ParseTreeTokenType.ARG_LIST &&
	getClosestOfType(previousToken.parentNode, ParseTreeTokenType.FUNCTION_CALL) !== null)
		return true;
	return false;
}

function isGoodExpressionDotChild(token) {
	if (token.parentNode.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
	!endsWithClosingCurvedBracket(token.parentNode))
		return true;
	return !goodExpressionDotChildTypes.has(token.parentNode.type);
}

function getExpressionDotExpression(previousToken) {
	if (goodExpressionDotChildTypes.has(previousToken.type))
		return previousToken;
	else {
		while (!isGoodExpressionDotChild(previousToken))
			previousToken = previousToken.parentNode;
		return previousToken;
	}
}

function isGoodPrevious(token) {
	if (token.parentNode === null || token.parentNode.type === ParseTreeTokenType.TREE_ROOT)
		return true;
	if (token.parentNode.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		return !endsWithClosingCurvedBracket(token.parentNode);
	return !badPreviousTypes.has(token.type);
}

function getGoodPrevious(previousToken) {
	while (!isGoodPrevious(previousToken))
		previousToken = previousToken.parentNode;
	return previousToken;
}

export function processDot(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	if (shouldCreateExpressionDot(previousToken)) {
		const expr = getExpressionDotExpression(previousToken);
		const exprParent = expr.parentNode;
		const eDot = new ParseTreeToken(null, expr.lineIndex, expr.colIndex, ParseTreeTokenType.EXPRESSION_DOT);
		expr.remove();
		eDot.appendChild(expr);
		eDot.appendChild(nextToken);
		exprParent.appendChild(eDot);
	}
	else if (appendSiblingPreviousTypes.has(previousToken.type)) {
		previousToken.appendSibling(nextToken);
	}
	else if (shouldAppendChild(previousToken, nextToken))
		previousToken.appendChild(nextToken);
	else
		previousToken.appendSibling(nextToken);
};