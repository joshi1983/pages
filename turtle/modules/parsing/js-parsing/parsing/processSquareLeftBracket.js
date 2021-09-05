import { addCodeBlockIfNeeded } from
'./addCodeBlockIfNeeded.js';
import { addToken } from './addToken.js';
import { endsWithCurlyRightBracket } from './endsWithCurlyRightBracket.js';
import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { endsWithSquareRightBracket } from './endsWithSquareRightBracket.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { SetUtils } from '../../../SetUtils.js';

const badPreviousTypes = new Set([
	ParseTreeTokenType.ARG_LIST,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.FUNCTION,
	ParseTreeTokenType.INDEX_EXPRESSION
]);

const expressionIndexExpressionPreviousTypes = new Set([
	ParseTreeTokenType.ARRAY_LITERAL,
	ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.INDEX_EXPRESSION,
	ParseTreeTokenType.THIS
]);
const indexExpressionPreviousTypes = new Set([
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.TEMPLATE_LITERAL
]);
const alwaysGoodPreviousParentTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.COLON,
	ParseTreeTokenType.TREE_ROOT
]);

SetUtils.addAll(indexExpressionPreviousTypes, expressionIndexExpressionPreviousTypes);

function shouldNewParentBeIndexExpression(previousToken) {
	return indexExpressionPreviousTypes.has(previousToken.type);
}

function isGoodPrevious(token) {
	if (token.parentNode === null || alwaysGoodPreviousParentTypes.has(token.parentNode.type))
		return true;
	if (token.parentNode.type === ParseTreeTokenType.CONDITIONAL_TERNARY)
		return true;
	if (token.parentNode.type === ParseTreeTokenType.CURLY_BRACKET_EXPRESSION &&
	!endsWithCurlyRightBracket(token.parentNode))
		return true;
	if ((token.parentNode.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
	token.parentNode.type === ParseTreeTokenType.ARG_LIST) &&
	!endsWithClosingCurvedBracket(token.parentNode))
		return true;
	if (token.parentNode.type === ParseTreeTokenType.BINARY_OPERATOR ||
	token.parentNode.type === ParseTreeTokenType.AWAIT)
		return true;
	if (badPreviousTypes.has(token.type))
		return false;
	if (token.type === ParseTreeTokenType.CODE_BLOCK) {
		if (endsWithCurlyRightBracket(token)) {
			return false;
		}
	}
	else if (token.type === ParseTreeTokenType.IDENTIFIER) {
		return token.children.length === 0 ||
		token.parentNode.type === ParseTreeTokenType.TREE_ROOT;
	}
	return true;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

function shouldCreateExpressionIndexExpressionForPrevious(previousToken) {
	return expressionIndexExpressionPreviousTypes.has(previousToken.type);
}

function isGoodPreviousTokenForIndexExpressionIndex(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DOT)
		return true;
	if (parent.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
		if (!endsWithClosingCurvedBracket(parent))
			return false;
		return true;
	}
	if (parent.type === ParseTreeTokenType.INDEX_EXPRESSION ||
	parent.type === ParseTreeTokenType.ARRAY_LITERAL) {
		if (!endsWithSquareRightBracket(parent))
			return false;
		return true;
	}
	return expressionIndexExpressionPreviousTypes.has(parent.type);
}

function getPreviousTokenForExpressionIndexExpression(previousToken) {
	while (isGoodPreviousTokenForIndexExpressionIndex(previousToken)) {
		previousToken = previousToken.parentNode;
	}
	return previousToken;
}

export function processSquareLeftBracket(previousToken, nextToken) {
	if (addCodeBlockIfNeeded(previousToken, nextToken)) {
		const next = previousToken.getNextSibling();
		if (next !== null)
			previousToken = next;
	}
	let newParentType;
	previousToken = getGoodPrevious(previousToken);
	if (shouldNewParentBeIndexExpression(previousToken))
		newParentType = ParseTreeTokenType.INDEX_EXPRESSION;
	else
		newParentType = ParseTreeTokenType.ARRAY_LITERAL;
	const newParentToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, newParentType);
	if (newParentType === ParseTreeTokenType.INDEX_EXPRESSION) {
		if (shouldCreateExpressionIndexExpressionForPrevious(previousToken)) {
			const eieToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION);
			previousToken = getPreviousTokenForExpressionIndexExpression(previousToken);
			const prevParent = previousToken.parentNode;
			previousToken.remove();
			eieToken.appendChild(previousToken);
			eieToken.appendChild(newParentToken);
			prevParent.appendChild(eieToken);
		}
		else {
			previousToken.appendChild(newParentToken);
		}
	}
	else {
		addToken(previousToken, newParentToken);
	}
	newParentToken.appendChild(nextToken);
};